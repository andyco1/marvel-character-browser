import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { mockApiResponse } from '../../shared/testing/mock-data';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    const apiUrl = `${environment.marvelApiUrl}/characters?apikey=${environment.marvelPublicKey}`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch characters without search term', () => {
        service.getCharacters().subscribe((response) => {
            expect(response).toEqual(mockApiResponse);
        });

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockApiResponse);
    });

    it('should handle API errors', () => {
        service.getCharacters().subscribe({
            next: () => fail('Should have failed with a 404 error'),
            error: (error) => {
                expect(error.status).toBe(404);
            }
        });

        const req = httpMock.expectOne(apiUrl);
        req.flush('Error fetching characters', {
            status: 404,
            statusText: 'Not Found'
        });
    });
});
