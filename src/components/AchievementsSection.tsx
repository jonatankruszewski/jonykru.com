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

const AchievementsSection = () => {
    return (
        <div className="py-4 xl:gap-16 sm:py-16">
            <div
                className="gap-2 sm:border-[#33353F] sm:flex-wrap sm:border rounded-md py-8 px-16
           flex flex-col sm:flex-row items-start justify-between
           xs:grid xs:grid-cols-2 xs:gap-4">
                {achievementsList.map((achievement) => { // No need for index if not used in rendering logic
                    return (
                        <div
                            key={achievement.metric}
                            className="flex-1 w-full flex flex-col align-top items-center text-center justify-center"
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
                                    className="text-white text-4xl font-bold"
                                />
                            </h2>
                            <p className="text-[#ADB7BE] text-base">{achievement.metric}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsSection;
