import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HomePage } from './home.page';
import { ApiService } from '../core/services/api.service';
import { NotificationService } from '../core/services/notification.service';
import { mockApiResponse } from '../shared/testing/mock-data';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let apiService: ApiService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomePage],
            providers: [
                { provide: ApiService, useValue: jasmine.createSpyObj('ApiService', ['getCharacters']) },
                NotificationService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        apiService = TestBed.inject(ApiService);
    });

    it('should populate characters after fetching from API', () => {
        (apiService.getCharacters as jasmine.Spy).and.returnValue(of(mockApiResponse));

        component.ngOnInit();

        expect(component.characters).toEqual(mockApiResponse.data.results);
    });
});
