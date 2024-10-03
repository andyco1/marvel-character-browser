import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CharacterSearchComponent } from './character-search.component';

describe('CharacterSearchComponent', () => {
    let component: CharacterSearchComponent;
    let fixture: ComponentFixture<CharacterSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                IonicModule.forRoot(),
                CharacterSearchComponent,
                FormsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit the search term after the debounce time', fakeAsync(() => {
        spyOn(component.searchTermChanged, 'emit');
        const searchbar = fixture.debugElement.query(By.css('ion-searchbar'));
        const event = { detail: { value: 'Spider' } } as CustomEvent;

        searchbar.triggerEventHandler('ionInput', event);

        expect(component.searchTermChanged.emit).not.toHaveBeenCalled();
        tick(800);
        expect(component.searchTermChanged.emit).toHaveBeenCalledWith('Spider');
    }));

    it('should wait for the debounce time before emitting', fakeAsync(() => {
        spyOn(component.searchTermChanged, 'emit');
        const searchbar = fixture.debugElement.query(By.css('ion-searchbar'));
        const event = { detail: { value: 'Iron Man' } } as CustomEvent;

        searchbar.triggerEventHandler('ionInput', event);

        tick(400);
        expect(component.searchTermChanged.emit).not.toHaveBeenCalled();
        tick(400);
        expect(component.searchTermChanged.emit).toHaveBeenCalledWith('Iron Man');
    }));

    it('should emit an empty string when search input is cleared', fakeAsync(() => {
        spyOn(component.searchTermChanged, 'emit');
        const searchbar = fixture.debugElement.query(By.css('ion-searchbar'));
        const event = { detail: { value: '' } } as CustomEvent;

        searchbar.triggerEventHandler('ionInput', event);
        tick(800);

        expect(component.searchTermChanged.emit).toHaveBeenCalledWith('');
    }));
});
