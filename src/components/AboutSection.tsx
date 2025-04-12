'use client'

import AboutMeCardsSection from '@/components/AboutMeCards'
import Achievements from '@/components/Achievements'
import Presentation from '@/components/Presentation'
import Section from '@/utils/Section'

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
