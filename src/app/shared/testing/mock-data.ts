import { MarvelApiResponse } from '../../../app/shared/models/marvel-character';

export const mockApiResponse: MarvelApiResponse = {
    code: 200,
    status: 'Ok',
    data: {
        offset: 0,
        limit: 20,
        total: 1,
        count: 1,
        results: [
            {
                id: 1,
                name: 'Character 1',
                description: '',
                thumbnail: {
                    path: 'http://example.com/image',
                    extension: 'jpg'
                },
                resourceURI: 'http://example.com/resource'
            }
        ]
    }
};
