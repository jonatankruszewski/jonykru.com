"use client";

import {HTMLAttributes, ReactNode, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {Sections, useSectionContext} from "@/context/sectionContext";
import {useRouter} from 'next/navigation';

const Section = ({children, id, ...props}: { children: ReactNode, id: Sections } & HTMLAttributes<HTMLElement>) => {
    const router = useRouter();
    const {setVisibleSection} = useSectionContext()
    const {ref: sectionRef, inView, entry} = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        if (!inView) {
            return;
        }

        const section = entry?.target.id as Sections
        setVisibleSection(section);
        router.replace(`#${section}`, {scroll: false})

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, entry?.target.id])

    return (
        <section id={id} ref={sectionRef} {...props}>
            {children}
        </section>
    )
}

export default Section;
