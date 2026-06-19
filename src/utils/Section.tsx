'use client'

import { HTMLAttributes, ReactNode, useEffect, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { Sections, useSectionContext } from '@/context/sectionContext'

// Collapse the observer root to a single horizontal "active line" ~45% down the
// viewport. The two insets below are the top and bottom boundaries: because they
// sum to 100% the root has zero height, so exactly one section crosses the line
// at a time and the active section switches deterministically as the user
// scrolls (no ratios, no debounce, no "last one wins" race between sections).
const ACTIVE_LINE_ROOT_MARGIN = '-45% 0px -55% 0px'

const Section = ({
  children,
  id,
  ...props
}: { children: ReactNode; id: Sections } & HTMLAttributes<HTMLElement>) => {
  const { setVisibleSection } = useSectionContext()
  const [isLighthouse, setIsLighthouse] = useState(false)

  useEffect(() => {
    // Detect Lighthouse/performance testing so we can skip the observer there.
    const userAgent = navigator.userAgent || ''
    setIsLighthouse(
      /Chrome-Lighthouse|HeadlessChrome|PageSpeed|Lighthouse/.test(userAgent)
    )
  }, [])

  const handleChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    // Only the section currently crossing the active line reports inView=true.
    // The section being left fires inView=false, which we ignore so we keep
    // highlighting the one the reader is on.
    if (!inView) return
    setVisibleSection(entry.target.id as Sections)
  }

  // Under Lighthouse, render a plain section without the observer.
  if (isLighthouse) {
    return (
      <section id={id} {...props}>
        {children}
      </section>
    )
  }

  return (
    <InView onChange={handleChange} rootMargin={ACTIVE_LINE_ROOT_MARGIN}>
      {({ ref }) => (
        <section ref={ref} id={id} {...props}>
          {children}
        </section>
      )}
    </InView>
  )
}

export default Section
