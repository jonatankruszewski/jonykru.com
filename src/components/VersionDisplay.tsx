'use client'

import { REPO_URL } from '@/data/site'
import versionData from '../../public/version.json'

interface VersionInfo {
  version: string
  timestamp: string
}

const versionInfo = versionData as VersionInfo

const VersionDisplay = () => {
  if (!versionInfo || !versionInfo.version) {
    return null
  }

  const { version } = versionInfo

  // The version is the footer's quiet "this site is open source" wink — it links
  // to the repository. (The build always runs on the version-bump commit, so
  // linking to that commit would only ever show a one-line diff.)
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-label tabular-nums text-accent underline-offset-4 decoration-2 hover:underline transition-all"
      title={`Source · v${version}`}
      aria-label={`View source code (version ${version})`}
    >
      v{version}
    </a>
  )
}

export default VersionDisplay
