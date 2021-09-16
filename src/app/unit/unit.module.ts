import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitIndexComponent } from '../unit/unit-index/unit-index.component';
import {UnitRoutingModule} from './unit-routing.module';
import {SharedModule} from '../shared/shared.module';
@NgModule({
  declarations: [
    UnitIndexComponent
  ],
  imports: [
    CommonModule, UnitRoutingModule, SharedModule
  ]
})
export class UnitModule { }
