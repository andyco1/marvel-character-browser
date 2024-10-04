import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { mockMarvelApiResponse } from 'src/app/shared/testing/mock-data';
import { CharacterDetailComponent } from './character-detail.component';
import { ApiService } from '../../core/services/api.service';

describe('CharacterDetailComponent', () => {
    let component: CharacterDetailComponent;
    let fixture: ComponentFixture<CharacterDetailComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(async () => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCharacterById']);

        await TestBed.configureTestingModule({
            imports: [
                IonicModule.forRoot(),
                CharacterDetailComponent
            ],
            providers: [
                { provide: ApiService, useValue: apiServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterDetailComponent);
        component = fixture.componentInstance;
        component.characterId = 1;
    });

    it('should create', async () => {
        expect(component).toBeTruthy();
    });

    describe('Component Init', () => {
        it('should fetch character details', async () => {
            apiServiceSpy.getCharacterById.and.returnValue(of(mockMarvelApiResponse));
    
            fixture.detectChanges();
            await fixture.whenStable();
    
            expect(apiServiceSpy.getCharacterById).toHaveBeenCalledWith(1);
            expect(component.character).toEqual(mockMarvelApiResponse.data.results[0]);
        });
    
        it('should handle error when fetching character details fails', async () => {
            spyOn(console, 'error');  // Spy on console.error to suppress output
            apiServiceSpy.getCharacterById.and.returnValue(throwError(() => new Error('API error')));
        
            fixture.detectChanges();
            await fixture.whenStable();
        
            expect(component.character).toBeUndefined();
            expect(console.error).toHaveBeenCalledWith('Error fetching character details:', jasmine.any(Error));
        });
        
        it('should log an error when fetching character details fails', async () => {
            const consoleSpy = spyOn(console, 'error');
            apiServiceSpy.getCharacterById.and.returnValue(throwError(() => new Error('API error')));
    
            fixture.detectChanges();
            await fixture.whenStable();
    
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching character details:', jasmine.any(Error));
        });
    });
});
