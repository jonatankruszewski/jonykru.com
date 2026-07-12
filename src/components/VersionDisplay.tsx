'use client'

import { FontJetBrainsMono } from '@/app/fonts'
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

  return (
    <span
      className={`${FontJetBrainsMono.className} text-label text-ink-muted tabular-nums`}
      title={`Version: ${versionInfo.version}`}
    >
      v{versionInfo.version}
    </span>
  )
}

export default VersionDisplay
