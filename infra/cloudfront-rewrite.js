// CloudFront Function — viewer-request, attached to the default behaviour.
//
// The site is a Next.js static export (`output: 'export'`, `trailingSlash: true`),
// so every route is a directory containing index.html:
//
//   out/index.html
//   out/certifications/index.html
//   out/open-source/index.html
//
// An S3 REST/OAC origin has no concept of an "index document" (only the S3
// *website* endpoint does), so it cannot resolve `/certifications/` on its own —
// it returns 403/404. This function does that resolution at the edge:
//
//   /certifications      -> 301 to /certifications/   (what people actually paste)
//   /certifications/     -> rewrite to /certifications/index.html
//   /_next/static/x.js   -> untouched (has a file extension)
//
// Deploy:
//   aws cloudfront create-function \
//     --name jonykru-rewrite \
//     --function-config Comment="index.html rewrite",Runtime=cloudfront-js-2.0 \
//     --function-code fileb://infra/cloudfront-rewrite.js
//   aws cloudfront publish-function --name jonykru-rewrite --if-match <ETag>
// Then associate it with the default cache behaviour on viewer-request.
//
// Also set, on the distribution:
//   Default root object: index.html
//   Custom error responses: 403 -> /404.html (404), 404 -> /404.html (404)

function handler(event) {
  var request = event.request
  var uri = request.uri

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html'
    return request
  }

  var lastSegment = uri.split('/').pop()
  if (!lastSegment.includes('.')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: uri + '/' } }
    }
  }

  return request
}
