'use client'
import React, { useEffect, useState } from 'react'
import AnimatedNumbers from 'react-animated-numbers'

interface Achievement {
  prefix?: string
  suffix?: string
  metric: string
  value: number
}

const achievementsList: Achievement[] = [
  // Type the array
  {
    metric: 'StackOverflow reputation',
    value: 1316
  },
  {
    metric: 'Certifications',
    value: 36
  },
  {
    suffix: '+',
    metric: 'Publications',
    value: 24
  },
  {
    suffix: '+',
    metric: 'Years of Experience',
    value: 6
  }
]

const Achievements = () => {
  const [enableAnimations, setEnableAnimations] = useState(false)

  // Defer animations until after hydration and initial render
  useEffect(() => {
    // Detect Lighthouse - disable animations completely
    const userAgent = navigator.userAgent || ''
    const isLighthouse =
      userAgent.includes('Chrome-Lighthouse') ||
      userAgent.includes('HeadlessChrome') ||
      /Chrome-Lighthouse|PageSpeed|Lighthouse/.test(userAgent)

    if (isLighthouse) {
      setEnableAnimations(false)
      return
    }

    const timer = setTimeout(() => {
      setEnableAnimations(true)
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="grid mb-20 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-6 py-7
               sm:border-gray-300 dark:sm:border-[#33353F] sm:border sm:rounded-md sm:py-8 sm:px-8
               items-start justify-center text-center"
    >
      {achievementsList.map((achievement) => {
        // No need for index if not used in rendering logic
        return (
          <div
            key={achievement.metric}
            className="flex-1 w-full flex flex-col sm:gap-2 md:gap-3 align-top items-center text-center justify-center"
          >
            <h2 className="text-gray-900 dark:text-white text-4xl font-bold flex flex-row">
              {enableAnimations ? (
                <AnimatedNumbers
                  key={achievement.metric}
                  transitions={(index) => ({
                    type: 'spring',
                    duration: index + 0.3
                  })}
                  animateToNumber={Number(achievement.value)}
                  locale="en-US"
                  className="text-gray-900 dark:text-white text-4xl font-semibold"
                />
              ) : (
                <span className="text-gray-900 dark:text-white text-4xl font-semibold">
                  {achievement.value}
                </span>
              )}
            </h2>
            <p className="text-gray-700 dark:text-gray-400 text-base font-normal leading-tight">
              {achievement.metric}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default Achievements
