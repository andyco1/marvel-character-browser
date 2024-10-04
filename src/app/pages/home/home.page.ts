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
        this.characters = [];
        const infiniteScroll = document.querySelector('ion-infinite-scroll');
        if (infiniteScroll) {
            infiniteScroll.disabled = false;
        }
        this.fetchCharacters(searchTerm);
    }

    public loadMoreCharacters(event: any): void {
        const offset = this.characters.length;
        const limit = 20;
        
        this.apiService.getCharacters(offset, limit, this.searchTerm || '').subscribe({
            next: (response) => {
                const newCharacters = response.data.results;
                if (newCharacters.length > 0) {
                    this.characters = [...this.characters, ...newCharacters];
                }
                if (newCharacters.length < limit) {
                    event.target.disabled = true;
                }
                event.target.complete();
            },
            error: (error) => {
                console.error('Error loading more characters:', error);
                this.notificationService.showErrorToast('Failed to load more characters');
                event.target.complete();
            }
        });
    }    

    private async fetchCharacters(searchTerm: string = ''): Promise<void> {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            spinner: 'crescent'
        });
        const offset = 0;
        const limit = 20;
    
        await loading.present();

        this.apiService.getCharacters(offset, limit, searchTerm).subscribe({
            next: async (data) => {
                this.characters = data.data.results;
                await loading.dismiss();
                if (!this.characters || this.characters.length === 0) {
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
