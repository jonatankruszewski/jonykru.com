export type CredlyBadge = {
    id: string;
    badge_template: {
        name: string;
        skills: { id: string; name: string; }[]
        url: string;
    };
    image_url: string;
    issuer_linked_in_name: string;
    issuer: {
        entities: {
            entity: { name: string; }
        }[]
    }
}

export type CredlyData = {
    data: CredlyBadge[];
}
