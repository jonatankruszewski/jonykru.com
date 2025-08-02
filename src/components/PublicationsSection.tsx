'use client'
import { motion, useInView as useMotionInView } from 'framer-motion'
import React, { useRef } from 'react'

import ProjectCard from '@/components/ProjectCard'
import { MediumFlatData } from '@/types/medium.types'
import Section from '@/utils/Section'

const PublicationsSection = ({
  mediumData
}: {
  mediumData: MediumFlatData[]
}) => {
  const cardRef = useRef(null)
  const isCardInView = useMotionInView(cardRef, { once: true })

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  }

  if (!mediumData || mediumData.length === 0) {
    return null
  }

  return (
    <Section id="publications">
      <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
        Latest Publications
      </h2>
      <ul
        ref={cardRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
      >
        {mediumData &&
          mediumData.length > 0 &&
          mediumData.map((article, index) => (
            <motion.li
              key={article.guid}
              variants={cardVariants}
              initial="initial"
              animate={isCardInView ? 'animate' : 'initial'}
              transition={{ duration: 0.2, delay: index * 0.15 }}
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
