import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'app-character-search',
    templateUrl: './character-search.component.html',
    styleUrls: ['./character-search.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule
    ]
})
export class CharacterSearchComponent {

    @Output() searchTermChanged: EventEmitter<string> = new EventEmitter<string>();
    
    private searchSubject = new Subject<string>();

    constructor() {
        this.searchSubject.pipe(
            debounceTime(800),
        ).subscribe((searchTerm: string) => {
            this.searchTermChanged.emit(searchTerm);
        });
    }

    public onSearchChange(event: CustomEvent): void {
        const searchTerm = event.detail.value || '';
        this.searchSubject.next(searchTerm);
    }
}
