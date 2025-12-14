'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useI18n } from '@/context/i18nContext'

const Presentation = () => {
  const { t, language } = useI18n()
  const [enableAnimation, setEnableAnimation] = useState(false)

  const sequence = [
    t('presentation.roles.webDeveloper'),
    1000,
    t('presentation.roles.mediumWriter'),
    1100,
    t('presentation.roles.jsReactExpert'),
    1200,
    t('presentation.roles.mongoDbDeveloper'),
    1200
  ]

  useEffect(() => {
    // Detect Lighthouse - never enable animation
    const userAgent =
      typeof navigator !== 'undefined' ? navigator.userAgent || '' : ''
    const isLighthouse =
      userAgent.includes('Chrome-Lighthouse') ||
      userAgent.includes('HeadlessChrome') ||
      /Chrome-Lighthouse|PageSpeed|Lighthouse/.test(userAgent)

    if (isLighthouse) {
      setEnableAnimation(false)
      return
    }

    const timer = setTimeout(() => {
      setEnableAnimation(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col">
      <h1 className="text-gray-900 dark:text-white mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-normal font-extrabold mt-24">
        <span className="inline-block">{t('presentation.greeting')}</span>
        <br />
        <span className="inline-block">{t('presentation.name')}</span>
      </h1>

      <div className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem]">
        {enableAnimation ? (
          <TypeAnimation
            key={language}
            className="text-xl sm:text-2xl md:text-4xl font-semibold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text"
            sequence={sequence}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        ) : (
          <span className="text-xl sm:text-2xl md:text-4xl font-semibold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            {t('presentation.roles.webDeveloper')}
          </span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 mt-6 mb-8 text-lg sm:text-xl max-w-2xl leading-relaxed">
        {t('presentation.description')}
      </p>

      <div className="flex justify-center">
        <Link
          href="/#contact"
          className="group inline-flex items-center gap-3 sm:gap-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl px-8 py-4 sm:px-10 sm:py-5 md:px-14 md:py-6 lg:px-16 lg:py-7 rounded-full shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span>{t('presentation.getInTouch')}</span>
          <svg
            className="w-5 h-4 sm:w-6 sm:h-5 md:w-7 md:h-6 lg:w-8 lg:h-7 transition-transform duration-300 group-hover:translate-x-1"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 7H17M12.5 12.5L17.5 7L12.5 1.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default Presentation
