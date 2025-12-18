'use client'

import { Button } from '@headlessui/react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import { useI18n } from '@/context/i18nContext'

interface CardKey {
  titleKey: string
  contentKey: string
}

const CARD_KEYS: CardKey[] = [
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

const AUTOPLAY_DELAY_MS = 4000

const AboutMeCards = () => {
  const { t, isRTL } = useI18n()
  const autoplayRef = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      direction: isRTL ? 'rtl' : 'ltr',
      slidesToScroll: 1
    },
    [autoplayRef.current]
  )

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
    autoplayRef.current?.reset()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
    autoplayRef.current?.reset()
  }, [emblaApi])

  // Reinitialize carousel when RTL direction changes
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit({ direction: isRTL ? 'rtl' : 'ltr' })
  }, [emblaApi, isRTL])

  const buttonClassName =
    'text-gray-500 dark:text-gray-400 w-9 h-9 rounded-full cursor-pointer flex justify-center items-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95 transition-all duration-200'

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {CARD_KEYS.map((card) => (
            <div
              key={card.titleKey}
              className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1a2e] dark:to-[#16162a] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 h-full">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t(card.titleKey)}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(card.contentKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Force LTR direction to keep arrows in correct visual order */}
      <div className="flex justify-center gap-3 mt-4" dir="ltr">
        <Button
          className={buttonClassName}
          name={t('carousel.previous')}
          onClick={scrollPrev}
        >
          <span className="sr-only">{t('carousel.previous')}</span>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          className={buttonClassName}
          name={t('carousel.next')}
          onClick={scrollNext}
        >
          <span className="sr-only">{t('carousel.next')}</span>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default AboutMeCards
