import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingModalIndexComponent } from './setting-modal-index/setting-modal-index.component';
import {SharedModule} from '../shared/shared.module';
import { LanguageSettingComponent } from './language-setting/language-setting.component';
import { GableSettingComponent } from '../setting/gable-setting/gable-setting.component';
import { HostSettingComponent } from './host-setting/host-setting.component';
import { EnvSettingComponent } from './env-setting/env-setting.component';
import { GlobalSettingComponent } from '../setting/global-setting/global-setting.component';
import { FileCenterComponent } from '../setting/file-center/file-center.component';

@NgModule({
  declarations: [
    SettingModalIndexComponent,
    LanguageSettingComponent,
    GableSettingComponent,
    HostSettingComponent,
    EnvSettingComponent,
    GlobalSettingComponent,
    FileCenterComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingModule { }
