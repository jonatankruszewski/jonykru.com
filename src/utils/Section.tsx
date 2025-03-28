"use client";

import {HTMLAttributes, ReactNode} from "react";
import {InView} from "react-intersection-observer";
import {Sections, useSectionContext} from "@/context/sectionContext";
import {useRouter} from 'next/navigation';

const Section = ({children, id, ...props}: { children: ReactNode, id: Sections } & HTMLAttributes<HTMLElement>) => {
    const router = useRouter();
    const {setVisibleSection} = useSectionContext()

    const setInView = (inView: boolean, entry: IntersectionObserverEntry) => {
        if (inView) {
            const sectionId = entry.target.id as Sections
            setVisibleSection(sectionId);
            router.replace(`#${sectionId}`, {scroll: false})
        }
    };

    return (
        <InView onChange={setInView} threshold={0.1} key={id}>
            {({ref}) => {
                return (
                    <section ref={ref} id={id} {...props}>
                        {children}
                    </section>
                );
            }}
        </InView>
    )
}

export default Section;
