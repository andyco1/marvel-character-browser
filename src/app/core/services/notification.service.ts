import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private toastController: ToastController) {}

    public async showErrorToast(message?: string, duration: number = 3000): Promise<void> {
        const toastMessage = message || 'There was an error...';
        const toast = await this.toastController.create({
            message: toastMessage,
            duration,
            color: 'danger',
            position: 'bottom'
        });
        await toast.present();
    }

    public async showSuccessToast(message?: string, duration: number = 3000): Promise<void> {
        const toastMessage = message || 'Success!';
        const toast = await this.toastController.create({
            message: toastMessage,
            duration,
            color: 'success',
            position: 'bottom'
        });
        await toast.present();
    }
}
