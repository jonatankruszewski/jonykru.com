import React from "react";
import {transformCredlyUrl} from "@/utils/transformCredlyUrl";

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

function zigZagSort(pills: string[]) {
    // const sorted = [...pills].sort((a, b) => a.length - b.length);
    //
    // const result = [];
    // let left = 0, right = sorted.length - 1;
    //
    // while (left <= right) {
    //     if (right !== left) result.push(sorted[right--]); // Take longest remaining
    //     result.push(sorted[left++]); // Take shortest remaining
    // }
    //
    // return result;
    const sorted = [...pills].sort((a, b) => a.length - b.length);

    const result = [];
    let left = 0, right = sorted.length - 1;
    let flip = true; // Controls starting order per line

    while (left <= right) {
        if (flip) {
            result.push(sorted[right--]); // Take longest first
            if (left <= right) result.push(sorted[left++]); // Then shortest
        } else {
            result.push(sorted[left++]); // Take shortest first
            if (left <= right) result.push(sorted[right--]); // Then longest
        }
        flip = !flip; // Alternate starting order
    }

    return result;
}

const CertificationCard: React.FC<CertificationCardProps> = (
    {
        badgeData,
        imgUrl,
        title,
        previewUrl,
    }) => {

    // console.info({badgeData})
    // const styles = imgUrl ? {background: `url(${imgUrl})`, backgroundSize: "cover"} : {}
    // const description: string = badgeData?.badge_template.description || ""

    return (
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="overflow-hidden lg:p-6 block cursor-pointer text-white">
            <img className="w-full max-w-[200px] mx-auto p-4" src={transformCredlyUrl(imgUrl)} alt="Badge"/>
            <div className="font-bold text-xl mb-5 text-center">
                {title}
            </div>
            <div className="flex items-center flex-wrap justify-center">
                {zigZagSort(badgeData.badge_template.skills)
                    .slice(0, 5)
                    .map((skill: string) => {
                    return <span
                        key={skill}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                       {skill}
                    </span>
                })}
            </div>
        </a>
    );
};

export default CertificationCard;
