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
      className={`${FontJetBrainsMono.className} text-xs text-gray-800 dark:text-gray-300`}
      title={`Version: ${versionInfo.version}`}
    >
      v{versionInfo.version}
    </span>
  )
}

export default VersionDisplay

