// src/app/pages/home/home.page.ts

import { Component, OnInit } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CharacterListComponent } from 'src/app/components/character-list/character-list.component';
import { CharacterSearchComponent } from 'src/app/components/character-search/character-search.component';
import { MarvelCharacter } from 'src/app/shared/models/marvel-character';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CharacterListComponent,
        CharacterSearchComponent
    ]
})
export class HomePage implements OnInit {
    public characters: MarvelCharacter[] = [];
    public searchTerm: string = '';

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService,
        private loadingController: LoadingController 
    ) {}

    public ngOnInit(): void {
        this.fetchCharacters();
    }

    public onSearchTermChanged(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.fetchCharacters(searchTerm);
    }

    private async fetchCharacters(searchTerm: string = ''): Promise<void> {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            spinner: 'circles',
            cssClass: 'custom-loading',
        });

        await loading.present();

        this.apiService.getCharacters(searchTerm).subscribe({
            next: async (data) => {
                this.characters = data.data.results;
                await loading.dismiss();
                if (!this.characters) {
                    this.notificationService.showErrorToast('No characters found!');
                }
            },
            error: async (err) => {
                await loading.dismiss();
                this.notificationService.showErrorToast('Error fetching characters.');
                console.error('Error fetching characters:', err);
            }
        });
    }
}
