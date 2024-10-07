export interface MarvelApiResponse {
    code: number;
    status: string;
    data: MarvelData;
}

export interface MarvelData {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: MarvelCharacter[];
}

export interface MarvelCharacter {
    id: number;
    name: string;
    description: string;
    thumbnail: MarvelThumbnail;
    resourceURI: string;
}

export interface MarvelThumbnail {
    path: string;
    extension: string;
}
