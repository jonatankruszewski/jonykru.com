'use client'

import React from 'react'
import VersionDisplay from '@/components/VersionDisplay'
import { useI18n } from '@/context/i18nContext'

const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="relative mt-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      <div className="container mx-auto px-4 md:px-6 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Jonatan Kruszewski.{' '}
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
            <p>{t('footer.builtWith')}</p>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <VersionDisplay />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
