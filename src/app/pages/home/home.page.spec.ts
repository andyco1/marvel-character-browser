import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { mockEmptyMarvelApiResponse, mockMarvelApiResponse } from 'src/app/shared/testing/mock-data';
import { HomePage } from './home.page';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let loadingControllerSpy: jasmine.SpyObj<LoadingController>;

    beforeEach(async () => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['getCharacters']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showErrorToast']);
        loadingControllerSpy = jasmine.createSpyObj('LoadingController', ['create']);

        const mockLoadingElement = {
            present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
            dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
        } as unknown as HTMLIonLoadingElement;
        loadingControllerSpy.create.and.returnValue(Promise.resolve(mockLoadingElement));

        await TestBed.configureTestingModule({
            imports: [
                IonicModule.forRoot(),
                HomePage
            ],
            providers: [
                { provide: ApiService, useValue: apiServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy },
                { provide: LoadingController, useValue: loadingControllerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
    });

    describe('Component Init', () => {
        it('should load initial characters', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockMarvelApiResponse));
            
            fixture.detectChanges();
            await fixture.whenStable();
            
            expect(apiServiceSpy.getCharacters).toHaveBeenCalledWith(0, 20, '');
            expect(component.characters.length).toBe(2);
        });

        it('should handle API error during initial load', async () => {
            const errorResponse = new Error('Internal Server Error');
            apiServiceSpy.getCharacters.and.returnValue(throwError(() => errorResponse));
            spyOn(console, 'error');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('Error fetching characters.');
            expect(console.error).toHaveBeenCalledWith('Error fetching characters:', errorResponse);
        });

        it('should show "No characters found!" toast when no characters are returned', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockEmptyMarvelApiResponse));

            fixture.detectChanges();
            await fixture.whenStable();

            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('No characters found!');
            expect(component.characters.length).toBe(0);
        });
    });

    describe('onSearchTermChanged', () => {
        it('should fetch characters based on the search term', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockMarvelApiResponse));
            
            component.onSearchTermChanged('Spider');
            fixture.detectChanges();
            await fixture.whenStable();
            
            expect(apiServiceSpy.getCharacters).toHaveBeenCalledWith(0, 20, 'Spider');
            expect(component.characters.length).toBe(2);
        });

        it('should handle API error during search term change', async () => {
            const errorResponse = new Error('Internal Server Error');
            apiServiceSpy.getCharacters.and.returnValue(throwError(() => errorResponse));
            spyOn(console, 'error');

            component.onSearchTermChanged('Spider');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('Error fetching characters.');
            expect(console.error).toHaveBeenCalledWith('Error fetching characters:', errorResponse);
        });

        it('should show "No characters found!" toast when no characters are returned during search', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockEmptyMarvelApiResponse));

            component.onSearchTermChanged('NonExistentCharacter');
            fixture.detectChanges();
            await fixture.whenStable();

            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('No characters found!');
            expect(component.characters.length).toBe(0);
        });
    });

    describe('loadMoreCharacters', () => {
        it('should load more characters on infinite scroll', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockMarvelApiResponse));
            const event = { target: { complete: jasmine.createSpy('complete') } };
            component.characters = mockMarvelApiResponse.data.results;

            component.loadMoreCharacters(event);
            await fixture.whenStable();

            expect(apiServiceSpy.getCharacters).toHaveBeenCalledWith(2, 20, '');
            expect(component.characters.length).toBe(4);
            expect(component.characters[2].name).toBe('Spider-Man');
            expect(event.target.complete).toHaveBeenCalled();
        });

        it('should handle API error during infinite scroll', async () => {
            const errorResponse = new Error('Internal Server Error');
            apiServiceSpy.getCharacters.and.returnValue(throwError(() => errorResponse));
            spyOn(console, 'error');
            const event = { target: { complete: jasmine.createSpy('complete') } };
            component.characters = mockMarvelApiResponse.data.results;

            component.loadMoreCharacters(event);
            await fixture.whenStable();

            expect(notificationServiceSpy.showErrorToast).toHaveBeenCalledWith('Failed to load more characters');
            expect(console.error).toHaveBeenCalledWith('Error loading more characters:', errorResponse);
            expect(event.target.complete).toHaveBeenCalled();
        });

        it('should disable infinite scroll when no more characters are available', async () => {
            apiServiceSpy.getCharacters.and.returnValue(of(mockEmptyMarvelApiResponse))
            const event = { target: { complete: jasmine.createSpy('complete'), disabled: false } };
            component.characters = mockMarvelApiResponse.data.results;

            component.loadMoreCharacters(event);
            await fixture.whenStable();

            expect(apiServiceSpy.getCharacters).toHaveBeenCalledWith(2, 20, '');
            expect(event.target.disabled).toBe(true);
            expect(event.target.complete).toHaveBeenCalled();
        });
    });
});
