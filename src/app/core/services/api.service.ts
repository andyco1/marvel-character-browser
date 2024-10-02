import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MarvelApiResponse } from "src/app/shared/models/marvel-character";
import { environment } from "src/environments/environment.prod";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = environment.marvelApiUrl;
    private publicKey = environment.marvelPublicKey;

    constructor(private http: HttpClient) {}

    public getCharacters(offset: number = 0, limit: number = 20, nameStartsWith?: string): Observable<MarvelApiResponse> {
        let url = `${this.apiUrl}/characters?apikey=${this.publicKey}&offset=${offset}&limit=${limit}`;
        
        if (nameStartsWith) {
            url += `&nameStartsWith=${nameStartsWith}`;
        }
        
        return this.http.get<MarvelApiResponse>(url);
    }

    public getCharacterById(id: number): Observable<MarvelApiResponse> {
        const url = `${this.apiUrl}/characters/${id}?apikey=${this.publicKey}`;
        return this.http.get<MarvelApiResponse>(url);
    }
}
