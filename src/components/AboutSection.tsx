'use client'

import dynamic from 'next/dynamic'
import Section from '@/utils/Section'

const Presentation = dynamic(() => import('@/components/Presentation'), {
  ssr: false
})

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
