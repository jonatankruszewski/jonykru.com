"use client";

import React, {useRef} from "react";
import ProjectCard from "@/components/ProjectCard";
import {motion, useInView as useMotionInView} from "framer-motion";
import {useQuery} from '@tanstack/react-query';
import {extractImageLinks} from "@/utils/extractImageLinks";
import Section from "@/utils/Section";

type Feed = {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
};

type Article = {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    enclosure?: {
        url: string;
        length: string;
        type: string;
    };
    categories?: string[];
    images?: string[];
};

type MediumData = {
    feed: Feed;
    items: Article[];
}

const PublicationsSection = () => {
    const {data} = useQuery({ //TODO: add isLoading state
        queryKey: ['posts'],
        queryFn: () => fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze').then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }
            return res.json() as unknown as MediumData;
        }),
    });

    data?.items.map(item => item.images = extractImageLinks(item.content));
    const cardRef = useRef(null);
    const isCardInView = useMotionInView(cardRef, {once: true});

    const cardVariants = {
        initial: {y: 50, opacity: 0},
        animate: {y: 0, opacity: 1},
    };

    return (
        <Section id="publications">
            <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
                Latest Publications
            </h2>
            <ul ref={cardRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {data && data.items.length > 0 && data.items.map((article, index) => (
                    <motion.li
                        key={article.guid}
                        variants={cardVariants}
                        initial="initial"
                        animate={isCardInView ? "animate" : "initial"}
                        transition={{duration: 0.2, delay: index * 0.15}}
                    >
                        <ProjectCard
                            key={article.guid}
                            title={article.title}
                            imgUrl={article && article.images && article.images.length > 0 ? article.images[0] : undefined}
                            previewUrl={article.link}
                        />
                    </motion.li>
                ))}
            </ul>
        </Section>
    )
};

export default PublicationsSection;
