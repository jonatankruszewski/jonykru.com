import {MediumData} from "@/types/medium.types";

export const getMediumData = async () => {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze", {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        return {items: []} satisfies MediumData
    }

    return await res.json() as MediumData;
};
