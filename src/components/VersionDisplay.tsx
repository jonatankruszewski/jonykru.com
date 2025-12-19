'use client'

import { useEffect, useState } from 'react'
import { FontJetBrainsMono } from '@/app/fonts'

interface VersionInfo {
  version: string
  timestamp: string
}

const VersionDisplay = () => {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null)

  useEffect(() => {
    // Fetch version info from public directory
    fetch('/version.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch version.json: ${res.status}`)
        }
        return res.json()
      })
      .then((data: VersionInfo) => setVersionInfo(data))
      .catch(() => {
        // Fallback if version.json doesn't exist or fetch fails
        setVersionInfo({
          version: '0.0.0',
          timestamp: new Date().toISOString(),
        })
      })
  }, [])

  if (!versionInfo) return null

  return (
    <span
      className={`${FontJetBrainsMono.className} text-xs text-gray-500 dark:text-gray-500`}
      title={`Version: ${versionInfo.version}`}
    >
      v{versionInfo.version}
    </span>
  )
}

export default VersionDisplay

