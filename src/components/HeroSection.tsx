"use client";
import React from "react";
import {TypeAnimation} from "react-type-animation";
import Link from "next/link";

const sequence = [
    "Web Developer",
    1000,
    "Medium Tech Writer",
    1100,
    "Javascript & React Expert",
    1200,
    "MongoDB Licensed Developer",
    1200,
]

const HeroSection = () => {
    return (
        <section className="items-center lg:pt-16">
            <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-6xl lg:leading-normal font-extrabold">
                <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
                    Hi! 👋,
                </span>
                <br></br>
                <span className="text-white bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
                    I'm Jonatan Kruszewski
                </span>
            </h1>

            <div className="grid grid-cols-12 lg:grid-cols-1">
                <TypeAnimation
                    className="grid-cols-12 text-cyan-500 text-2xl lg:text-4xl font-extrabold"
                    sequence={sequence}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
                <p className="mt-4 text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">
                    I specialize in building scalable, maintainable front-end solutions that work seamlessly—without the
                    tech debt nightmare. </p>
                <div className="flex items-center justify-center gap-4 py-4">
                    <Link
                        href="/#contact"
                        className="px-6 inline-block py-3 w-full sm:w-fit rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white"
                    >
                        Contact Me
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
