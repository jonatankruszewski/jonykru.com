"use client";
import React, {useRef} from "react";
import ProjectCard from "@/components/ProjectCard";
import {motion, useInView} from "framer-motion";
import {useQuery} from '@tanstack/react-query';
import {extractImageLinks} from "@/utils/extractImageLinks";

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
    const {data, error, isLoading} = useQuery({
        queryKey: ['posts'],
        queryFn: () => fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze').then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }
            return res.json() as unknown as MediumData;
        }),
    });

    data?.items.map(item => item.images = extractImageLinks(item.content));

    // console.info({data, error, isLoading})

    const ref = useRef(null);
    const isInView = useInView(ref, {once: true});

    const cardVariants = {
        initial: {y: 50, opacity: 0},
        animate: {y: 0, opacity: 1},
    };

    return (
        <section id="publications">
            <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
                {`My ${!error && '10 Latest '}Publications`}
            </h2>
            <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
                {data && data.items.length > 0 && data.items.map((article, index) => (
                    <motion.li
                        key={article.guid}
                        variants={cardVariants}
                        initial="initial"
                        animate={isInView ? "animate" : "initial"}
                        transition={{duration: 0.3, delay: index * 0.25}}
                    >
                        <ProjectCard
                            key={article.guid}
                            title={article.title}
                            description={article.description}
                            imgUrl={article && article.images && article.images.length > 0 ? article.images[0] : undefined}
                            gitUrl={article.link}
                            previewUrl={article.link}
                        />
                    </motion.li>
                ))}
            </ul>
        </section>
    );
};

export default PublicationsSection;
