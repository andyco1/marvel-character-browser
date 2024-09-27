import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MarvelApiResponse, MarvelCharacter } from '../../shared/models/marvel-character';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.marvelApiUrl;
    private publicKey = environment.marvelPublicKey;

    constructor(private http: HttpClient) {}

    public getCharacters(nameStartsWith?: string): Observable<MarvelApiResponse> {
        const url = `${this.apiUrl}/characters?apikey=${this.publicKey}`;
    
        const finalUrl = nameStartsWith ? `${url}&nameStartsWith=${nameStartsWith}` : url;
    
        return this.http.get<MarvelApiResponse>(finalUrl);
    }
}
