import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonIcon,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { folderOutline, trashOutline, informationCircleOutline, chevronForward } from 'ionicons/icons';
import { ConfigService } from 'src/app/services/config.service';
import { ManageCategoriesModalComponent } from 'src/app/shared/components/manage-categories-modal/manage-categories-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonButtons,
    IonBackButton
  ]
})
export class SettingsPage {
  private modalController = inject(ModalController);
  public configService = inject(ConfigService);

  constructor() {
    addIcons({
      'folder-outline': folderOutline,
      'trash-outline': trashOutline,
      'information-circle-outline': informationCircleOutline,
      'chevron-forward': chevronForward
    });
  }

  async openCategoryManager() {
    const modal = await this.modalController.create({
      component: ManageCategoriesModalComponent
    });

    await modal.present();
  }
}
