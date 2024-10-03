import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { MarvelApiResponse } from '../../shared/models/marvel-character';
import { mockMarvelApiResponse } from '../../shared/testing/mock-data';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;
    const apiUrl = 'https://gateway.marvel.com/v1/public';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch characters with default parameters (offset = 0, limit = 20)', () => {
        service.getCharacters().subscribe((response: MarvelApiResponse) => {
            expect(response.code).toBe(200);
            expect(response.status).toBe('Ok');
            expect(response.data.results.length).toBe(2);
            expect(response.data.results).toEqual(mockMarvelApiResponse.data.results);
        });

        const req = httpMock.expectOne(`${apiUrl}/characters?apikey=${environment.marvelPublicKey}&offset=0&limit=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMarvelApiResponse);
    });

    it('should fetch characters with custom offset and limit', () => {
        const offset = 40;
        const limit = 50;

        service.getCharacters(offset, limit).subscribe((response: MarvelApiResponse) => {
            expect(response.code).toBe(200);
            expect(response.status).toBe('Ok');
            expect(response.data.results.length).toBe(2);
            expect(response.data.results).toEqual(mockMarvelApiResponse.data.results);
        });

        const req = httpMock.expectOne(`${apiUrl}/characters?apikey=${environment.marvelPublicKey}&offset=${offset}&limit=${limit}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMarvelApiResponse);
    });

    it('should fetch characters with a nameStartsWith parameter', () => {
        const searchTerm = 'Spider';

        service.getCharacters(0, 20, searchTerm).subscribe((response: MarvelApiResponse) => {
            expect(response.code).toBe(200);
            expect(response.status).toBe('Ok');
            expect(response.data.results.length).toBe(2);
            expect(response.data.results).toEqual(mockMarvelApiResponse.data.results);
        });

        const req = httpMock.expectOne(`${apiUrl}/characters?apikey=${environment.marvelPublicKey}&offset=0&limit=20&nameStartsWith=${searchTerm}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMarvelApiResponse);
    });

    it('should handle error response', () => {
        service.getCharacters().subscribe(
            () => fail('Should have failed with an error'),
            (error) => {
                expect(error).toBeTruthy();
            }
        );

        const req = httpMock.expectOne(`${apiUrl}/characters?apikey=${environment.marvelPublicKey}&offset=0&limit=20`);
        req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should fetch character by ID', () => {
        const characterId = 1;

        service.getCharacterById(characterId).subscribe((response: MarvelApiResponse) => {
            expect(response.code).toBe(200);
            expect(response.status).toBe('Ok');
            expect(response.data.results[0].id).toBe(characterId);
        });

        const req = httpMock.expectOne(`${apiUrl}/characters/${characterId}?apikey=${environment.marvelPublicKey}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockMarvelApiResponse);
    });
});
