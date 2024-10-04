import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons'
import { close } from 'ionicons/icons'
import { MarvelCharacter } from 'src/app/shared/models/marvel-character';
import { ApiService } from '../../core/services/api.service';

@Component({
    selector: 'app-character-detail',
    templateUrl: './character-detail.component.html',
    styleUrls: ['./character-detail.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule
    ]
})
export class CharacterDetailComponent implements OnInit {
    @Input() characterId!: number;

    public character?: MarvelCharacter | undefined;

    constructor(
        private modalController: ModalController,
        private apiService: ApiService
    ) {
        addIcons({ close })
    }

    public ngOnInit(): void {
        if (this.characterId) {
            this.fetchCharacterDetails();
        }
    }

    private fetchCharacterDetails(): void {
        this.apiService.getCharacterById(this.characterId).subscribe({
            next: (data) => {
                this.character = data.data.results[0];
            },
            error: (err) => {
                console.error('Error fetching character details:', err);
                this.character = undefined;
            }
        });
    }
    
    public dismiss(): void {
        this.modalController.dismiss();
    }
}
