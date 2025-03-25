import {HTMLAttributes, ReactNode, useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {Sections, useSectionContext} from "@/context/sectionContext";

const Section = ({children, id, ...props}: { children: ReactNode, id: Sections } & HTMLAttributes<HTMLElement>) => {
    const {setVisibleSection} = useSectionContext()
    const {ref: sectionRef, inView, entry} = useInView({
        threshold: 0.1,
    });

    useEffect(() => {
        if (!inView) {
            return;
        }

        setVisibleSection(entry?.target.id as Sections)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView, entry?.target.id])

    return (
        <section id={id} ref={sectionRef} {...props}>
            {children}
        </section>
    )
}

export default Section;
