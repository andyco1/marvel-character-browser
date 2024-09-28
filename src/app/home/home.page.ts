import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { NotificationService } from '../core/services/notification.service';
import { MarvelCharacter } from '../shared/models/marvel-character';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true
})
export class HomePage implements OnInit {
    public characters?: MarvelCharacter[];

    constructor(
        private apiService: ApiService,
        private notificationService: NotificationService
    ) {}

    public ngOnInit(): void {
        this.fetchCharacters();
    }

    private fetchCharacters(): void {
        this.apiService.getCharacters().subscribe({
            next: (data) => {
                this.characters = data.data.results;
            },
            error: (err) => {
                this.notificationService.showErrorToast('Error fetching characters...');
                console.error('Error fetching characters:', err);
            },
            complete: () => console.log('Character fetching completed')
        });
    }
}
