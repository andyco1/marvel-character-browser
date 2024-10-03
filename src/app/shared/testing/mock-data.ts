import { MarvelApiResponse } from "../models/marvel-character";

export const mockMarvelApiResponse: MarvelApiResponse = {
    code: 200,
    status: 'Ok',
    data: {
        offset: 0,
        limit: 2,
        total: 2,
        count: 2,
        results: [
            {
                id: 1,
                name: 'Spider-Man',
                description: 'Friendly neighborhood Spider-Man.',
                thumbnail: {
                    path: 'http://path.to/spiderman',
                    extension: 'jpg'
                },
                resourceURI: 'http://gateway.marvel.com/v1/public/characters/1'
            },
            {
                id: 2,
                name: 'Iron Man',
                description: 'Genius billionaire philanthropist.',
                thumbnail: {
                    path: 'http://path.to/ironman',
                    extension: 'jpg'
                },
                resourceURI: 'http://gateway.marvel.com/v1/public/characters/2'
            }
        ]
    }
};

export const additionalMockMarvelApiResponse: MarvelApiResponse = {
    code: 200,
    status: 'Ok',
    data: {
        offset: 20,
        limit: 20,
        total: 4,
        count: 2,
        results: [
            {
                id: 3,
                name: 'Hulk',
                description: 'A scientist who transforms into a green-skinned giant when enraged',
                resourceURI: 'http://gateway.marvel.com/v1/public/characters/1009351',
                thumbnail: {
                    path: 'path_to_image_hulk',
                    extension: 'jpg'
                }
            },
            {
                id: 4,
                name: 'Thor',
                description: 'The Norse God of Thunder',
                resourceURI: 'http://gateway.marvel.com/v1/public/characters/1009664',
                thumbnail: {
                    path: 'path_to_image_thor',
                    extension: 'jpg'
                }
            }
        ]
    }
};

export const mockEmptyMarvelApiResponse: MarvelApiResponse = {
    code: 200,
    status: 'Ok',
    data: {
        offset: 0,
        limit: 0,
        total: 0,
        count: 0,
        results: []
    }
};
