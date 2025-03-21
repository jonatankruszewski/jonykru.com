import React from "react";
import Link from "next/link";

type ProjectCardProps = {
    imgUrl?: string;
    title: string;
    previewUrl: string;
};

const ProjectCard: React.FC<ProjectCardProps> = (
    {
        imgUrl,
        title,
        previewUrl,
    }) => {

    const styles = imgUrl ? {background: `url(${imgUrl})`, backgroundSize: "cover", backgroundPosition: "center"} : {}
    //
    // if (!imgUrl){
    //     return null;
    // }

    return (
        <Link href={previewUrl} className="bg-[#1E1E2E] rounded-xl border border-gray-700 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg flex flex-col flex-1 h-full cursor-pointer">
            <div className="md:h-72 rounded-t-xl relative group overflow-hidden aspect-square w-full" style={styles}>
                <div className="max-h-[250px] absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
            </div>
            <div className="text-white rounded-b-xl p-6">
                <p className="text-xl font-bold tracking-tight mb-2">{title}</p>
            </div>
        </Link>
    );
};

export default ProjectCard;
