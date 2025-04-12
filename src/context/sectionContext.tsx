'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { useInView } from 'react-intersection-observer'

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
  const { ref } = useInView({
    threshold: 0.2
  })

  return (
    <sectionContext.Provider value={{ visibleSection, setVisibleSection }}>
      <div ref={ref} id="section-wrapper">
        {children}
      </div>
    </sectionContext.Provider>
  )
}

export default SectionProvider
