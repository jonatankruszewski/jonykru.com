# Infra

## Why any of this exists

The site is a Next.js **static export** (`output: 'export'`), synced to S3 and
served through CloudFront. With `trailingSlash: true`, each route is a directory:

```
out/index.html
out/blog/index.html
out/open-source/index.html
out/certifications/index.html
out/contact/index.html
```

A request for `/blog` asks S3 for a key called `blog`. That key does not exist —
only `blog/index.html` does. An S3 **REST/OAC** origin has no concept of an index
document, so it answers **403** (not even 404: under OAC a missing key is
AccessDenied). Only the legacy S3 _website_ endpoint resolves index documents.

`cloudfront-rewrite.js` does that resolution at the edge instead:

| Request              | Result                                         |
| -------------------- | ---------------------------------------------- |
| `/blog`              | 301 → `/blog/` (the URL people actually paste) |
| `/blog/`             | rewritten to `/blog/index.html`                |
| `/_next/static/x.js` | untouched — it has a file extension            |

**This failure is invisible locally.** `next dev` and `npx serve out` both resolve
bare paths for you, so every route looks perfect on your machine and 404s in
production. That is why the deploy step for it is _not_ `continue-on-error`.

## Deployment

Automatic. `.github/actions/deploy-cloudfront-function` runs on every deploy and
is idempotent — it only republishes the function when the code changed, and only
submits a distribution update when the config would actually change (a
distribution update takes minutes to propagate, so this matters).

It reconciles three things:

- the function, attached to the default behaviour on **viewer-request**
- `DefaultRootObject = index.html`
- custom error responses: **403 and 404 both → `/404.html`**. Both are needed —
  S3 answers 403 for a missing key under OAC, so mapping only 404 leaves users
  looking at an XML `AccessDenied` document.

### Required IAM permissions

Add these to the deploy user, alongside the existing S3 and invalidation rights:

```json
{
  "Effect": "Allow",
  "Action": [
    "cloudfront:DescribeFunction",
    "cloudfront:GetFunction",
    "cloudfront:CreateFunction",
    "cloudfront:UpdateFunction",
    "cloudfront:PublishFunction",
    "cloudfront:GetDistributionConfig",
    "cloudfront:UpdateDistribution"
  ],
  "Resource": "*"
}
```

### Running it once, by hand

If you want it live before the next deploy:

```bash
DIST_ID=<your distribution id>

aws cloudfront create-function \
  --name jonykru-rewrite \
  --function-config "Comment=Resolve directory URIs to index.html,Runtime=cloudfront-js-2.0" \
  --function-code fileb://infra/cloudfront-rewrite.js

ETAG=$(aws cloudfront describe-function --name jonykru-rewrite --query ETag --output text)
aws cloudfront publish-function --name jonykru-rewrite --if-match "$ETAG"
```

Then attach it — or just let the pipeline do it, which is the point of the action.

## Verifying it worked

Local `next dev` proves nothing here. Test the real distribution:

```bash
curl -sI https://www.jonykru.com/blog        # expect 301 -> /blog/
curl -sI https://www.jonykru.com/blog/       # expect 200
curl -s  https://www.jonykru.com/nonsense | head -1   # expect the 404 page, not XML
```

## Deployed state (as of v3.0.0)

Settled by inspection — no longer speculative:

|               |                                                                             |
| ------------- | --------------------------------------------------------------------------- |
| Distribution  | `E3RD99J8G8HCBA` (`jonykru.com`, `www.jonykru.com`)                         |
| Bucket        | `jonykru-porfolio` (`il-central-1`)                                         |
| Origin type   | **S3 REST** (`...s3.il-central-1.amazonaws.com`) — _not_ a website endpoint |
| Function      | `jonykru-rewrite`, LIVE, on viewer-request                                  |
| Origin access | **OAC** `jonykru-s3-oac` (SigV4, always)                                    |
| Bucket        | **private**; Block Public Access on                                         |

### Why not an S3 website endpoint?

A website endpoint would resolve `index.html` natively and make the function
unnecessary. It was rejected because it **cannot use OAC or OAI** — that is an
architectural limitation, not a setting. Choosing it would permanently force the
bucket to stay public, and force the CloudFront→S3 hop down to plain HTTP.

The function is what lets us keep a REST origin, which is what lets the bucket be
private. Fifteen lines of edge JS in exchange for a CDN-only origin is a good
trade.

### What was fixed

- `/blog` used to 403 (S3 REST has no index-document logic).
- Error responses mapped **403 and 404 → `/index.html` with HTTP 200** — an SPA
  catch-all. Every unknown URL served the home page with a success status, which
  search engines read as soft-404s and duplicate content. Now both map to
  `/404.html` with a real 404.
- The bucket was **publicly readable and directly fetchable**, bypassing the CDN
  entirely (no caching, no logs, S3 GET charges, and a second indexable hostname).
  It is now reachable only by this distribution.
