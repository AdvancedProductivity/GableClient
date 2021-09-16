import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingModalIndexComponent } from '../setting/setting-modal-index/setting-modal-index.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    SettingModalIndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class SettingModule { }
