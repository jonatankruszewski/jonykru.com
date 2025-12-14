'use client'

import { Button } from '@headlessui/react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import { useI18n } from '@/context/i18nContext'

const cardKeys = [
  {
    titleKey: 'aboutCards.aboutMe.title',
    contentKey: 'aboutCards.aboutMe.content'
  },
  {
    titleKey: 'aboutCards.expertise.title',
    contentKey: 'aboutCards.expertise.content'
  },
  {
    titleKey: 'aboutCards.experience.title',
    contentKey: 'aboutCards.experience.content'
  },
  {
    titleKey: 'aboutCards.community.title',
    contentKey: 'aboutCards.community.content'
  },
  {
    titleKey: 'aboutCards.communication.title',
    contentKey: 'aboutCards.communication.content'
  }
]

const AboutMeCards = () => {
  const { t } = useI18n()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: false, delay: 3000 })
  ])

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev()
  }

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext()
  }

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex flex-row gap-4 w-full px-4">
        {cardKeys.map((card) => (
          <div
            key={card.titleKey}
            className="bg-gray-100 dark:bg-[#1E1E2E] text-gray-900 dark:text-white p-6 rounded-2xl shadow-lg transform-gpu flex-[0_0_30%] min-w-[300px] pl-5"
          >
            <h2 className="text-xl font-semibold mb-2">{t(card.titleKey)}</h2>
            <p className="text-gray-800 dark:text-gray-300">
              {t(card.contentKey)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button
          className="bg-transparent text-black dark:text-white font-semibold w-8 h-8 border-2 border-black dark:border-white rounded-full cursor-pointer flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          name={t('carousel.previous')}
          onClick={scrollPrev}
        >
          <span className="sr-only">{t('carousel.previous')}</span>
          <ChevronLeft />
        </Button>

        <Button
          className="bg-transparent text-black dark:text-white font-semibold w-8 h-8 border-2 border-black dark:border-white rounded-full cursor-pointer flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          name={t('carousel.next')}
          onClick={scrollNext}
        >
          <span className="sr-only">{t('carousel.next')}</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

export default AboutMeCards
