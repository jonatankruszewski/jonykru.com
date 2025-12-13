'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
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

  return (
    <sectionContext.Provider value={{ visibleSection, setVisibleSection }}>
      {children}
    </sectionContext.Provider>
  )
}

export default SectionProvider
