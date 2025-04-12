'use client'

import Section from '@/utils/Section'
import Achievements from '@/components/Achievements'
import AboutMeCardsSection from '@/components/AboutMeCards'
import Presentation from '@/components/Presentation'

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
