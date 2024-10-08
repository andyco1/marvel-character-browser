import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MarvelCharacter } from 'src/app/shared/models/marvel-character';

@Component({
    selector: 'app-character-list',
    templateUrl: './character-list.component.html',
    styleUrls: ['./character-list.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule
    ]
})
export class CharacterListComponent {
    @Input() characters: MarvelCharacter[] = [];
}
