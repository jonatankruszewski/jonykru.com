'use client'

import { REPO_URL } from '@/data/site'
import versionData from '../../public/version.json'

interface VersionInfo {
  version: string
  timestamp: string
  commit?: string
}

const versionInfo = versionData as VersionInfo

const VersionDisplay = () => {
  if (!versionInfo || !versionInfo.version) {
    return null
  }

  const { version, commit } = versionInfo
  const href = commit ? `${REPO_URL}/commit/${commit}` : REPO_URL
  const shortSha = commit?.slice(0, 7)

  // The version is the footer's quiet "this site is open source" wink: it links
  // to the exact commit the build was cut from.
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-label tabular-nums text-accent underline-offset-4 decoration-2 hover:underline transition-all"
      title={
        shortSha ? `Source · v${version} (${shortSha})` : `Source · v${version}`
      }
      aria-label={`View source code (version ${version}${
        shortSha ? `, commit ${shortSha}` : ''
      })`}
    >
      v{version}
    </a>
  )
}

export default VersionDisplay
