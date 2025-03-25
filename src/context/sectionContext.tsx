"use client"

import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";

const sectionIds = [
    'hero',
    'about',
    'publications',
    'certifications',
    'contact',
];

export type Sections = typeof sectionIds[number];
type NullableSections = Sections | null;

const sectionContext = createContext<{
    visibleSection: NullableSections;
    setVisibleSection: Dispatch<SetStateAction<NullableSections>>
}>({
    visibleSection: null,
    setVisibleSection: () => null
});

export const useSectionContext = () => useContext(sectionContext);

const SectionProvider = ({children}: { children: ReactNode }) => {
    const [visibleSection, setVisibleSection] = useState<NullableSections>('about');

    return (
        <sectionContext.Provider value={{visibleSection, setVisibleSection}}>
            {children}
        </sectionContext.Provider>
    )
}

export default SectionProvider
