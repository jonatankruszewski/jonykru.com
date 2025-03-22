import React from "react";
import {transformCredlyUrl} from "@/utils/transformCredlyUrl";
import {zigZagSort} from "@/utils/zigZagSort";

type CertificationCardProps = {
    badgeData: Record<string, unknown> & {
        badge_template: {
            skills: string[]
        }
    };
    imgUrl: string;
    previewUrl: string;
    title: string;
};

const CertificationCard: React.FC<CertificationCardProps> = (
    {
        badgeData,
        imgUrl,
        title,
        previewUrl,
    }) => {

    return (
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden lg:p-6 block cursor-pointer text-white">
            <img className="w-full max-w-[200px] mx-auto p-4" src={transformCredlyUrl(imgUrl)} alt={`${title} Badge`}/>
            <h3 className="font-bold text-xl mb-5 text-center">
                {title}
            </h3>
            <div className="flex items-center flex-wrap justify-center">
                {zigZagSort(badgeData.badge_template.skills)
                    .slice(0, 5)
                    .map((skill: string) => {
                    return <p
                        key={skill}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                       {skill}
                    </p>
                })}
            </div>
        </a>
    );
};

export default CertificationCard;
