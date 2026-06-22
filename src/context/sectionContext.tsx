'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

const sectionIds = ['about', 'publications', 'certifications', 'contact']

export type Sections = (typeof sectionIds)[number]

const sectionContext = createContext<{
  visibleSection: Sections
  setVisibleSection: Dispatch<SetStateAction<Sections>>
}>({
  visibleSection: sectionIds[0],
  setVisibleSection: () => undefined
})

export const useSectionContext = () => useContext(sectionContext)

const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [visibleSection, setVisibleSection] = useState<Sections>(sectionIds[0])
  const didMount = useRef(false)

  // Keep the URL hash in sync with the section the reader is on. We use
  // history.replaceState rather than pushState (so scrolling doesn't fill the
  // back stack with every section) and rather than `location.hash = ...` (which
  // would trigger the browser's native anchor jump and fight smooth scroll).
  useEffect(() => {
    // Skip the initial render so we don't clobber an incoming deep link
    // (e.g. landing on /#contact) or dirty a clean "/" URL on first paint.
    if (!didMount.current) {
      didMount.current = true
      return
    }
    const newHash = `#${visibleSection}`
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash)
    }
  }, [visibleSection])

  return (
    <sectionContext.Provider value={{ visibleSection, setVisibleSection }}>
      {children}
    </sectionContext.Provider>
  )
}

export default SectionProvider
