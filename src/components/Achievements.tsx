"use client";
import React from "react";
import AnimatedNumbers from "react-animated-numbers";

interface Achievement {
    prefix?: string;
    suffix?: string;
    metric: string;
    value: number;
}

const achievementsList: Achievement[] = [ // Type the array
    {
        metric: "StackOverflow reputation",
        value: 1316,
    },
    {
        metric: "Certifications",
        value: 36,
    },
    {
        suffix: "+",
        metric: "Publications",
        value: 24,
    },
    {
        suffix: "+",
        metric: "Years of Experience",
        value: 6,
    },
];

const Achievements = () => {
    return (
        <div
            className="grid mb-20 sm:grid-cols-2 md:grid-cols-4 gap-4 gap-y-6 py-7
               sm:border-[#33353F] sm:border sm:rounded-md sm:py-8 sm:px-8
               items-start justify-center text-center"
        >
            {achievementsList.map((achievement) => { // No need for index if not used in rendering logic
                return (
                    <div
                        key={achievement.metric}
                        className="flex-1 w-full flex flex-col sm:gap-2 md:gap-3 align-top items-center text-center justify-center"
                    >
                        <h2 className="text-white text-4xl font-bold flex flex-row">
                            <AnimatedNumbers
                                key={achievement.metric}
                                transitions={(index) => ({
                                    type: "spring",
                                    duration: index + 0.3,
                                })}
                                animateToNumber={Number(achievement.value)}
                                locale="en-US"
                                className="text-white text-4xl font-semibold"
                            />
                        </h2>
                        <p className="text-gray-400 text-base font-light leading-tight">{achievement.metric}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Achievements;
