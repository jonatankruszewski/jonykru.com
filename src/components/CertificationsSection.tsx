"use client";
import React, {useState} from "react";
import ProjectTag from "@/components/ProjectTag";
import CertificationCard from "@/components/CertificationCard";
import Section from "@/utils/Section";
import {CredlyData} from "@/types/credly.types";

type CertificationsSectionProps = {
    credlyData: CredlyData
}

const CertificationsSection = ({credlyData}: CertificationsSectionProps) => {
    const {data} = credlyData;
    const uniqueSkills = [...new Set(data.flatMap(badge => badge.issuer.entities[0].entity.name || ""))].filter(Boolean);
    const providersMap = Object.fromEntries(uniqueSkills.map(skill => [skill.replaceAll(" ", "_").toLowerCase(), {
        value: false,
        label: skill,
        key: skill.replaceAll(" ", "_").toLowerCase(),
    }]));

    const [selectedProviders, setSelectedProviders] = useState(providersMap);
    const [all, setAll] = useState(true)

    const handleToggleAll = () => {
        if (all) {
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

        if (isNoneSelected) {
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
            return providersList.some(provider => provider.value && provider.label === badge.issuer_linked_in_name) || all;
        }).reverse();

    return (
        <Section id="certifications">
            <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
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
                When you hire a certified developer, you&apos;re not just trusting what they say — you&apos;re trusting
                what
                they&apos;ve proven.
            </p>

            <div
                className="text-white flex flex-row flex-wrap justify-center items-center gap-2 py-6 max-w-[900px] mx-auto">
                <ProjectTag
                    label="All"
                    isSelected={all}
                    onClick={handleToggleAll}
                />
                {Object.values(selectedProviders).sort((a, b) => a.label.localeCompare(b.label)).map(({
                      value,
                      label,
                      key
                  }) => (
                    <ProjectTag
                        key={key}
                        isSelected={value && !all}
                        label={label}
                        onClick={() => handleToggleProvider(key)}
                    />
                ))}
            </div>
            <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
                {filteredBadges.map(badge => (
                    <CertificationCard badge={badge} key={badge.id}/>
                ))}
            </ul>
        </Section>
    );
};

export default CertificationsSection;
