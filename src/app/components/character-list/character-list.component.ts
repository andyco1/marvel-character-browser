import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonicModule, IonModal, LoadingController } from "@ionic/angular";
import { ApiService } from "src/app/core/services/api.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { MarvelApiResponse, MarvelCharacter } from "src/app/shared/models/marvel-character";
import { CharacterDetailComponent } from "../character-detail/character-detail.component";

@Component({
    selector: 'app-character-list',
    templateUrl: './character-list.component.html',
    styleUrls: ['./character-list.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        CharacterDetailComponent
    ]
})
export class CharacterListComponent implements OnInit {
    @Input() public characters: MarvelCharacter[] = [];
    @ViewChild('characterDetailsModal') public characterDetailsModal?: IonModal;

    public characterId = 0;
    public offset = 0; // To keep track of pagination
    public limit = 20; // Number of characters to fetch per API call
    public loading = false;

    constructor(
        private loadingController: LoadingController,
        private notificationService: NotificationService,
        private apiService: ApiService
    ) {}

    public ngOnInit(): void {
        this.loadInitialCharacters();
    }
    
    private loadInitialCharacters(): void {
        this.loading = true;
        this.apiService.getCharacters(this.offset, this.limit).subscribe({
            next: (response: MarvelApiResponse) => {
                this.characters = response.data.results;
                this.loading = false;
                if (this.characters.length === 0) {
                    this.notificationService.showErrorToast('No characters found!');
                }
            },
            error: (error: any) => {
                this.loading = false;
                this.notificationService.showErrorToast('Failed to load characters');
                console.error('Error fetching characters:', error);
            }
        });
    }

    public async openCharacterDetail(characterId: number): Promise<void> {
        this.characterId = characterId;
        const loadingCtrl = await this.loadingController.create({
            message: 'Loading character details...',
            spinner: 'crescent'
        });
        await loadingCtrl.present();
    
        try {
            await this.characterDetailsModal?.present();
        } catch (error) {
            await this.notificationService.showErrorToast('Failed to open character details');
            console.error('Error presenting character details modal:', error);
        } finally {
            await loadingCtrl.dismiss();
        }
    }
}
