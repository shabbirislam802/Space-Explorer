export interface Article {
    title: string;
    summary: string;
    image_url: string;
    id: string;
    url: string;
    news_site: string;
}

export interface Planet {
    isPlanet: boolean;
    englishName: string;
    mass?: { massValue: number, massExponent: number };
    meanRadius?: number;
    density?: number;
    avgTemp?: number;
    discoveredBy?: string;
    discoveryDate?: string;
}