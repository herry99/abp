import { SettingTab } from '@abp/ng.theme.shared';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { ConfigState } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class SettingManagementService {
  settings: SettingTab[] = [];

  selected = {} as SettingTab;

  private destroy$ = new Subject();

  constructor(private router: Router, private store: Store) {
    setTimeout(() => {
      this.setSettings();
    }, 0);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  setSettings() {
    setTimeout(() => {
      const route = this.router.config.find(r => r.path === 'setting-management');
      this.settings = (route.data.settings as SettingTab[])
        .filter(setting => this.store.selectSnapshot(ConfigState.getGrantedPolicy(setting.requiredPolicy)))
        .sort((a, b) => a.order - b.order);
      this.checkSelected();
    }, 0);
  }

  checkSelected() {
    this.selected = this.settings.find(setting => setting.url === this.router.url) || ({} as SettingTab);

    if (!this.selected.name && this.settings.length) {
      this.setSelected(this.settings[0]);
    }
  }

  setSelected(selected: SettingTab) {
    this.selected = selected;
    this.store.dispatch(new Navigate([selected.url]));
  }
}
