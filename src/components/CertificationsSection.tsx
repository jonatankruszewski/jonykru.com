"use client";
import React, {useRef, useState} from "react";
import ProjectTag from "@/components/ProjectTag";
// import {motion, useInView} from "framer-motion";
import certifications from "./Certifications.json"
import CertificationCard from "@/components/CertificationCard";

const {data} = certifications;
const uniqueSkills = [...new Set(data.flatMap(badge => badge.issuer_linked_in_name))];

const providersMap = Object.fromEntries(uniqueSkills.map(skill => [skill.replaceAll(" ", "_").toLowerCase(), {
    value: false,
    label: skill,
    key: skill.replaceAll(" ", "_").toLowerCase(),
}]));

const CertificationsSection = () => {
    const [selectedProviders, setSelectedProviders] = useState(providersMap);
    const [all, setAll] = useState(true)
    const ref = useRef(null);
    // const isInView = useInView(ref, {once: true});

    const handleToggleAll = () => {
        if (all){
            return;
        }

        setSelectedProviders(providersMap)
        setAll(true);
    }

    const handleToggleProvider = (providerKey: string) => {
        const content = {...selectedProviders[providerKey]};
        content.value = !content.value;
        const newProviders = {...selectedProviders, [providerKey]: content};

        const isAllSelected = Object.values(newProviders).every(providerObj => providerObj.value);
        const isNoneSelected = Object.values(newProviders).every(providerObj => !providerObj.value);

        if (isAllSelected) {
            setAll(true)
            setSelectedProviders(providersMap)
            return;
        }

        if (isNoneSelected){
            setAll(true)
            setSelectedProviders(providersMap)
            return;
        }

        setAll(false);
        setSelectedProviders(newProviders);
    };

    const filteredBadges = data.filter(
        (badge) => {
            const providersList = Object.values(selectedProviders);
            return providersList.some(provider=> provider.value && provider.label === badge.issuer_linked_in_name) || all;
        }).reverse();

    return (
        <section id="certifications">
            <h2 className="text-center text-4xl font-bold text-white mb-12">
               Certifications
            </h2>
            <h3 className="text-2xl font-bold text-white mt-4 md:mt-6 mb-4 md:mb-6">
                Why Hire a Certified Developer?
            </h3>
            <p className="text-white">
                Anyone can write code, but not everyone writes scalable, maintainable, and high-quality code.
            </p>
            <p className="text-white">
                Certifications go beyond badges; they&apos;re proof that an external authority has reviewed, tested, and
                validated both knowledge and skills.
            </p>
            <p className="text-white">
                When you hire a certified developer, you&apos;re not just trusting what they say — you&apos;re trusting what
                they&apos;ve proven.
            </p>

            <div className="text-white flex flex-row flex-wrap justify-center items-center gap-2 py-6 max-w-[900px] mx-auto">
                <ProjectTag
                    label="All"
                    isSelected={all}
                    onClick={handleToggleAll}
                />
                {Object.values(selectedProviders).sort((a, b) => a.label.localeCompare(b.label)).map(({value, label, key}) => (
                    <ProjectTag
                        key={key}
                        isSelected={value && !all}
                        label={label}
                        onClick={()=> handleToggleProvider(key)}
                    />
                ))}
            </div>
            <ul ref={ref} className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
                {filteredBadges.map(badge => (
                    // <motion.li
                    //     key={index}
                    //     variants={cardVariants}
                    //     initial="initial"
                    //     animate={isInView ? "animate" : "initial"}
                    //     transition={{duration: 0.3, delay: index * 0.4}}
                    // >
                        <CertificationCard
                            badgeData={badge}
                            key={badge.id}
                            title={badge.badge_template.name}
                            // description={project.badge_template.description}
                            imgUrl={badge.image_url}
                            previewUrl={badge.badge_url}
                        />
                    // </motion.li>
                ))}
            </ul>
        </section>
    );
};

export default CertificationsSection;
