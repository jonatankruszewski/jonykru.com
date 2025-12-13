'use client'

import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { Sections, useSectionContext } from '@/context/sectionContext'

const Section = ({
  children,
  id,
  ...props
}: { children: ReactNode; id: Sections } & HTMLAttributes<HTMLElement>) => {
  const { setVisibleSection } = useSectionContext()
  const [isMounted, setIsMounted] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Wait for hydration to complete before enabling intersection observer
    // Delay to ensure all critical rendering is done first
    const mountTimer = setTimeout(() => {
      setIsMounted(true)
    }, 250)

    return () => {
      clearTimeout(mountTimer)
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const setInView = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (!isMounted || !inView) return

    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Debounce the update to prevent rapid-fire changes during scrolling
    updateTimeoutRef.current = setTimeout(() => {
      try {
        const sectionId = entry.target.id as Sections
        setVisibleSection(sectionId)

        // DISABLED: Router updates cause Lighthouse Navigation crashes
        // The active navigation highlighting works fine without URL hash changes
        // Users can still use navigation links which update the hash directly
      } catch (error) {
        // Silently fail during performance tests
        console.debug('Section update skipped:', error)
      }
    }, 150)
  }

  return (
    <InView
      onChange={setInView}
      threshold={0.3}
      triggerOnce={false}
      skip={!isMounted}
      key={id}
    >
      {({ ref }) => {
        return (
          <section ref={ref} id={id} {...props}>
            {children}
          </section>
        )
      }}
    </InView>
  )
}

export default Section
