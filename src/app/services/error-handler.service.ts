import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  async showErrorAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{ text: 'Cerrar' }],
    });
    await alert.present();
  }

  async showSuccessToast(message: string, duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();
  }

  async showErrorToast(message: string, duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color: 'danger',
    });
    await toast.present();
  }

  async showWarningToast(message: string, duration: number = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color: 'warning',
    });
    await toast.present();
  }

  async showConfirmAlert(
    header: string,
    message: string,
    confirmText: string = 'Sí',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    let confirmed = false;

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        { text: cancelText, role: 'cancel' },
        {
          text: confirmText,
          handler: () => {
            confirmed = true;
          },
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    return confirmed;
  }
}
