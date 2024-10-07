import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { NotificationService } from './notification.service';


describe('NotificationService', () => {
    let service: NotificationService;
    let toastControllerCreateSpy: jasmine.Spy;

    beforeEach(() => {
        const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
        toastControllerCreateSpy = toastControllerSpy.create.and.returnValue(
            Promise.resolve({ present: () => Promise.resolve() })
        );

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: ToastController, useValue: toastControllerSpy }
            ]
        });

        service = TestBed.inject(NotificationService);
    });

    describe('showErrorToast', () => {
        it('should show the default error message', async () => {
            await service.showErrorToast();

            expect(toastControllerCreateSpy).toHaveBeenCalledWith({
                message: 'There was an error...',
                duration: 3000,
                color: 'danger',
                position: 'bottom'
            });
        });

        it('should show a custom error message', async () => {
            const customMessage = 'Custom error message';

            await service.showErrorToast(customMessage);

            expect(toastControllerCreateSpy).toHaveBeenCalledWith({
                message: customMessage,
                duration: 3000,
                color: 'danger',
                position: 'bottom'
            });
        });
    });

    describe('showSuccessToast', () => {
        it('should show the default success message', async () => {
            await service.showSuccessToast();

            expect(toastControllerCreateSpy).toHaveBeenCalledWith({
                message: 'Success!',
                duration: 3000,
                color: 'success',
                position: 'bottom'
            });
        });

        it('should show a custom success message', async () => {
            const customMessage = 'Custom success message';

            await service.showSuccessToast(customMessage);

            expect(toastControllerCreateSpy).toHaveBeenCalledWith({
                message: customMessage,
                duration: 3000,
                color: 'success',
                position: 'bottom'
            });
        });
    });
});
