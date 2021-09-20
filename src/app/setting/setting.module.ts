import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingModalIndexComponent } from './setting-modal-index/setting-modal-index.component';
import {SharedModule} from '../shared/shared.module';
import { LanguageSettingComponent } from './language-setting/language-setting.component';
import { GableSettingComponent } from '../setting/gable-setting/gable-setting.component';
import { HostSettingComponent } from './host-setting/host-setting.component';

@NgModule({
  declarations: [
    SettingModalIndexComponent,
    LanguageSettingComponent,
    GableSettingComponent,
    HostSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingModule { }
