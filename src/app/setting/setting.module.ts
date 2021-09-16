import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingModalIndexComponent } from './setting-modal-index/setting-modal-index.component';
import {SharedModule} from '../shared/shared.module';
import { LanguageSettingComponent } from './language-setting/language-setting.component';

@NgModule({
  declarations: [
    SettingModalIndexComponent,
    LanguageSettingComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingModule { }
