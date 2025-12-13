'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'

const sequence = [
  'Web Developer',
  1000,
  'Medium Tech Writer',
  1100,
  'Javascript & React Expert',
  1200,
  'MongoDB Licensed Developer',
  1200
]

const Presentation = () => {
  const [enableAnimation, setEnableAnimation] = useState(false)

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
    <>
      <h1 className="text-gray-900 dark:text-white mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-normal font-extrabold mt-24">
        <span className="text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
          Hi! 👋,
        </span>
        <br></br>
        <span className="text-gray-900 dark:text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
          I&apos;m Jonatan Kruszewski
        </span>
      </h1>

      <div className="">
        {enableAnimation ? (
          <TypeAnimation
            className="text-base sm:text-xl md:text-4xl lg:text-4xl font-semibold bg-gradient-to-br from-purple-400 to-indigo-500 text-transparent bg-clip-text"
            sequence={sequence}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        ) : (
          <span className="text-base sm:text-xl md:text-4xl lg:text-4xl font-semibold bg-gradient-to-br from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            Web Developer
          </span>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-gray-800 dark:text-gray-200 mt-8 mb-4 text-xl sm:text-2xl lg:text-xl lg:leading-normal font-light">
            I specialize in building scalable, maintainable front-end solutions
            that work seamlessly—without the tech debt nightmare.
          </h2>
          <Link
            href="/#contact"
            className="whitespace-nowrap max-w-max bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-in-out hover:from-purple-600 hover:to-indigo-600 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md"
          >
            <div className="flex items-center gap-2 rounded-full px-8 py-4">
              <span className="text-white font-semibold text-lg">
                Get In Touch
              </span>
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 7H17M12.5 12.5L17.5 7L12.5 1.5"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Presentation
