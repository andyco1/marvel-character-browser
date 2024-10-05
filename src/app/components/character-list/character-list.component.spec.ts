import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { mockEmptyMarvelApiResponse, mockMarvelApiResponse } from 'src/app/shared/testing/mock-data';
import { CharacterListComponent } from './character-list.component';

describe('CharacterListComponent', () => {
    let component: CharacterListComponent;
    let fixture: ComponentFixture<CharacterListComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

    beforeEach(async () => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCharacters', 'getCharacterById']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showErrorToast']);
        loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);

        const mockLoadingElement = {
            present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
            dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
        } as unknown as HTMLIonLoadingElement;
        loadingControllerSpy.create.and.returnValue(Promise.resolve(mockLoadingElement));

        await TestBed.configureTestingModule({
            imports: [IonicModule.forRoot(), CharacterListComponent],
            providers: [
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy },
                { provide: LoadingController, useValue: loadingControllerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CharacterListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Init', () => {
        it('should display the list of characters after fetching from API', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockMarvelApiResponse));
    
            fixture.detectChanges();
            await fixture.whenStable();
    
            expect(apiServiceSpy.getCharacters).toHaveBeenCalledWith(0, 20);
            expect(component.characters.length).toBe(2);
            expect(component.characters[0].name).toBe('Spider-Man');
            expect(component.characters[1].name).toBe('Iron Man');
        });
    
        it('should show the error toast when no characters are found', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockEmptyMarvelApiResponse));
        
            fixture.detectChanges();
            await fixture.whenStable();
        
            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('No characters found!');
            expect(component.characters.length).toBe(0);
        });
    
        it('should show the error toast on an API error', async () => {
            const errorResponse = new Error('Internal Server Error');
            apiServiceSpy.getCharacters.and.returnValue(throwError(() => errorResponse));
            spyOn(console, 'error');
    
            fixture.detectChanges();
            await fixture.whenStable();
    
            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('Failed to load characters');
            expect(console.error).toHaveBeenCalledWith('Error fetching characters:', errorResponse);
        });
    });

    describe('openCharacterDetail', () => {
        it('should present the loading controller with the correct values and dismiss it', async () => {
            apiServiceSpy.getCharacterById.and.returnValue(of(mockMarvelApiResponse));
            const mockModalElement = {
                present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
                dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
            };
            component.characterDetailsModal = mockModalElement as any;

            await component.openCharacterDetail(123);
            await fixture.whenStable();
            const loadingElement = await loadingControllerSpy.create.calls.mostRecent().returnValue;

            expect(loadingControllerSpy.create).toHaveBeenCalledWith({
                message: 'Loading character details...',
                spinner: 'crescent'
            });
            expect(loadingElement.present).toHaveBeenCalled();
            expect(mockModalElement.present).toHaveBeenCalled();
            expect(loadingElement.dismiss).toHaveBeenCalled();
        });

        it('should present the character details modal', async () => {
            apiServiceSpy.getCharacterById.and.returnValue(of(mockMarvelApiResponse));
            const mockModalElement = {
                present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
                dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
            };
            component.characterDetailsModal = mockModalElement as any;

            await component.openCharacterDetail(123);
            await fixture.whenStable();

            expect(mockModalElement.present).toHaveBeenCalled();
        });

        it('should catch errors, display an error toast, and log the error to the console', async () => {
            const mockModalElement = {
                present: jasmine.createSpy('present').and.returnValue(Promise.reject('Modal present error')),
                dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
            };
            component.characterDetailsModal = mockModalElement as any;
            spyOn(console, 'error');

            await component.openCharacterDetail(123);
            await fixture.whenStable();
            const loadingElement = await loadingControllerSpy.create.calls.mostRecent().returnValue;

            expect(mockModalElement.present).toHaveBeenCalled();
            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('Failed to open character details');
            expect(console.error).toHaveBeenCalledWith('Error presenting character details modal:', 'Modal present error');
            expect(loadingElement.dismiss).toHaveBeenCalled();
        });
    });
});
