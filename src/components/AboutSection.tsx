'use client'

import dynamic from 'next/dynamic'
import Presentation from '@/components/Presentation'
import Section from '@/utils/Section'

// Only defer non-critical components for better LCP
const AboutMeCardsSection = dynamic(() => import('@/components/AboutMeCards'), {
  ssr: false
})

const Achievements = dynamic(() => import('@/components/Achievements'), {
  ssr: false
})

const AboutSection = () => {
  return (
    <Section id="about">
      <Presentation />
      <Achievements />
      <AboutMeCardsSection />
    </Section>
  )
}

export default AboutSection
