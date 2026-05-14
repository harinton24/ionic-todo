import { inject, Injectable } from '@angular/core';
import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private remoteConfig = inject(RemoteConfig);
  
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
      console.error('Error al sincronizar con Remote Config:', err);
      return this._showDeleteAll.value;
    }
  }
}