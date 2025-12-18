'use client'

import { useEffect } from 'react'
import { useI18n } from '@/context/i18nContext'

const RTLHandler = () => {
  const { language, direction } = useI18n()

  useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = language
  }, [language, direction])

  return null
}

export default RTLHandler
