"use client";

import React from "react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {ChevronLeft, ChevronRight} from "lucide-react";
import AchievementsSection from "@/components/AchievementsSection";
import { Button } from '@headlessui/react'

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
            <h2 className="text-center text-4xl font-bold text-white mb-12">
                About
            </h2>
            <AchievementsSection/>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex flex-row gap-4 w-full px-4">
                    {cards.map(card => (
                        <div key={card.title}
                             className="bg-[#1E1E2E] text-white p-6 rounded-2xl shadow-lg transform-gpu flex-[0_0_30%] min-w-[300px] pl-5">
                            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                            <p className="text-gray-300">{card.content}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        className="bg-transparent text-white font-semibold w-8 h-8 border-2 border-white rounded-full cursor-pointer flex justify-center items-center"
                        name="Previous"
                        onClick={scrollPrev}
                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft/>
                    </Button>

                    <Button
                        className="bg-transparent text-white font-semibold w-8 h-8 border-2 border-white rounded-full cursor-pointer flex justify-center items-center"
                        name="Next"
                        onClick={scrollNext}>
                        <span className="sr-only">Next</span>
                        <ChevronRight/>
                    </Button>
                </div>

            </div>
        </section>
    )
        ;
};

export default AboutMeCards;
