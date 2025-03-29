
export type Feed = {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
};

export type Article = {
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

export type MediumData = {
    feed?: Feed;
    items: Article[];
}
