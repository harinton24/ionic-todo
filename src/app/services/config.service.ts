import { inject, Injectable } from '@angular/core';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private remoteConfig = inject(RemoteConfig);
  private errorHandler = inject(ErrorHandlerService);
  
  private _showDeleteAll = new BehaviorSubject<boolean>(false);
  public showDeleteAll$ = this._showDeleteAll.asObservable();

  constructor() {
    this.remoteConfig.settings.minimumFetchIntervalMillis = 0;
    this.checkFeatureStatus();
  }

  async checkFeatureStatus(): Promise<boolean> {
    try {
      await fetchAndActivate(this.remoteConfig);
      const canDelete = getValue(this.remoteConfig, 'show_delete_button').asBoolean();
      
      this._showDeleteAll.next(canDelete);
      return canDelete;
    } catch (err) {
      await this.errorHandler.showWarningToast('No se pudo sincronizar Remote Config');
      return this._showDeleteAll.value;
    }
  }
}