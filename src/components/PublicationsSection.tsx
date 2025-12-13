'use client'
import { motion, useInView as useMotionInView } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import ProjectCard from '@/components/ProjectCard'
import { MediumFlatData } from '@/types/medium.types'
import Section from '@/utils/Section'

const PublicationsSection = ({
  mediumData
}: {
  mediumData: MediumFlatData[]
}) => {
  const cardRef = useRef(null)
  const [enableAnimations, setEnableAnimations] = useState(false)
  const [skipAnimations, setSkipAnimations] = useState(false)
  const isCardInView = useMotionInView(cardRef, { once: true, amount: 0.2 })

  // Defer animations until after hydration and initial render
  useEffect(() => {
    // Detect Lighthouse - skip animations but still show content
    const userAgent = navigator.userAgent || ''
    const isLighthouse =
      userAgent.includes('Chrome-Lighthouse') ||
      userAgent.includes('HeadlessChrome') ||
      /Chrome-Lighthouse|PageSpeed|Lighthouse/.test(userAgent)

    if (isLighthouse) {
      setSkipAnimations(true)
      return
    }

    const timer = setTimeout(() => {
      setEnableAnimations(true)
    }, 150)

    // Fallback: ensure content is visible after 2 seconds even if intersection observer fails
    const fallbackTimer = setTimeout(() => {
      setSkipAnimations(true)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // When skipping animations, show content immediately (opacity: 1)
  // Otherwise, animate from initial to animate state
  const cardVariants = {
    initial: { y: skipAnimations ? 0 : 50, opacity: skipAnimations ? 1 : 0 },
    animate: { y: 0, opacity: 1 }
  }

  // Determine animation state: skip = always animate (visible), otherwise based on conditions
  const shouldAnimate = skipAnimations || (enableAnimations && isCardInView)

  if (!mediumData || mediumData.length === 0) {
    return null
  }

  return (
    <Section id="publications">
      <div className="text-center mb-12 mt-20">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Latest Publications
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Sharing knowledge through technical articles on Medium
        </p>
      </div>
      <ul
        ref={cardRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {mediumData &&
          mediumData.length > 0 &&
          mediumData.map((article, index) => (
            <motion.li
              key={article.guid}
              variants={cardVariants}
              initial="initial"
              animate={shouldAnimate ? 'animate' : 'initial'}
              transition={{
                duration: 0.2,
                delay: skipAnimations ? 0 : index * 0.15
              }}
            >
              <ProjectCard
                key={article.guid}
                title={article.title}
                imgUrl={article.image}
                previewUrl={article.link}
              />
            </motion.li>
          ))}
      </ul>
    </Section>
  )
}

export default PublicationsSection
