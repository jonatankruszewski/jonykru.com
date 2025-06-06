'use client'
import Link from 'next/link'
import React from 'react'
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
  return (
    <>
      <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-normal font-extrabold mt-24">
        <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
          Hi! 👋,
        </span>
        <br></br>
        <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
          I&apos;m Jonatan Kruszewski
        </span>
      </h1>

      <div className="">
        <TypeAnimation
          className="text-base sm:text-xl md:text-4xl lg:text-4xl font-semibold bg-gradient-to-br from-purple-400 to-indigo-500 text-transparent bg-clip-text"
          sequence={sequence}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h2 className="text-gray-200 mt-8 mb-4 text-xl sm:text-2xl lg:text-xl lg:leading-normal font-light">
            I specialize in building scalable, maintainable front-end solutions
            that work seamlessly—without the tech debt nightmare.
          </h2>
          <Link
            href="/#contact"
            className="whitespace-nowrap max-w-max border-1 border-transparent bg-gradient-to-br from-purple-400 to-indigo-500 p-[1px] rounded-full transition-all duration-300 ease-in-out "
          >
            <div className="flex items-center gap-2 bg-[#121212] rounded-full px-8 py-4">
              <span className="bg-gradient-to-br from-purple-400 to-indigo-500 text-transparent bg-clip-text font-semibold text-lg">
                Get In Touch
              </span>
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>

                <path
                  d="M2 7H17M12.5 12.5L17.5 7L12.5 1.5"
                  stroke="url(#gradient)"
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
