// "use client";
// import { useInView } from "react-intersection-observer";
//
// import { useRouter } from "next/navigation";
// import { ReactNode, useEffect, useState } from "react";
//
// const IntersectionObserverComponent = ({ children }: { children: ReactNode }) => {
//     // const router = useRouter();
//     // const [isClient, setIsClient] = useState(false);
//     //
//     // useEffect(() => {
//     //     setIsClient(true);
//     // }, []);
//     //
//     // useEffect(() => {
//     //     if (!isClient) return; // Avoid running on the server
//     //
//     //     const observer = new IntersectionObserver(
//     //         (entries) => {
//     //             entries.forEach((entry) => {
//     //                 if (entry.isIntersecting) {
//     //                     router.push(`#${entry.target.id}`, undefined);
//     //                 }
//     //             });
//     //         },
//     //         {
//     //             threshold: 0.5,
//     //         }
//     //     );
//     //
//     //     const sections = document.querySelectorAll('section[id]');
//     //     sections.forEach((section) => observer.observe(section));
//     //
//     //     return () => {
//     //         sections.forEach((section) => observer.unobserve(section));
//     //     };
//     // }, [isClient, router]);
//     //
//     // if (!isClient) return null;
//
//     {/* Within the component */}
//     const { ref, inView } = useInView({
//         threshold: 0.2,
//     });
//
//     const [visibleSection, setVisibleSection] = useState("");
//
//     // @ts-ignore
//     const setInView = (inView: boolean, entry) => {
//         if (inView) {
//             setVisibleSection(entry.target.getAttribute("id"));
//         }
//     };
//     return <div ref={ref}>{children}</div>;
// };
//
// export default IntersectionObserverComponent;
