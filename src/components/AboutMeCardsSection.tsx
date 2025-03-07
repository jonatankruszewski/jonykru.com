"use client";

import React from "react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

const AboutMeCards = () => {
    const cards = [
        {
            title: "About Me 👋",
            content:
                "Hi! I’m Jonatan—a senior front-end developer who loves building things that actually work and don’t break the moment you look away.",
        },
        {
            title: "My Expertise ⚛️",
            content:
                "I specialize in React, Redux, TypeScript, and scalable architectures, making sure everything runs smoothly and stays maintainable.",
        },
        {
            title: "Experience 🏗️",
            content:
                "I've worked on large-scale applications, mentored developers, and helped teams clean up messy codebases. I write clean, efficient code that keeps projects scalable instead of turning into tech debt.",
        },
        {
            title: "Community & Writing ✍️",
            content:
                "I contribute to Stack Overflow, write about development, and stay updated with the latest in tech.",
        },
        {
            title: "Communication is key 🤝",
            content: "If you need someone who can get things done, solve real problems, and improve your codebase, let's connect!",
        },
    ];
    const [emblaRef, emblaApi] = useEmblaCarousel({loop: true}, [
        Autoplay({playOnInit: false, delay: 3000})
    ])


    const scrollPrev = () => {
        if (emblaApi) emblaApi.scrollPrev()
    }

    const scrollNext = () => {
        if (emblaApi) emblaApi.scrollNext()
    }


    return (
        <section className="text-white" id="about">
            <h2 className="my-12 text-4xl font-bold text-white">About Me</h2>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row gap-4 w-full px-4">
                    {cards.map((card, index) => (
                        <div key={card.title}
                             className="bg-[#1E1E2E] text-white p-6 rounded-2xl shadow-lg transform-gpu flex-[0_0_30%] min-w-[300px] pl-5">
                            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                            <p className="text-gray-300">{card.content}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        className="bg-transparent text-white font-semibold w-8 h-8 border border-white rounded-full cursor-pointer flex justify-center items-center"
                        onClick={scrollPrev}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                        </svg>
                    </button>

                    <button
                        className="bg-transparent text-white font-semibold w-8 h-8 border border-white rounded-full cursor-pointer flex justify-center items-center"
                        onClick={scrollNext}>
                        <span className="sr-only">Next</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    )
        ;
};

export default AboutMeCards;
