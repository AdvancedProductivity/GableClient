import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitIndexComponent } from './unit-index/unit-index.component';
import {UnitTwoRoutingModule} from './unit-two-routing.module';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [
    UnitIndexComponent
  ],
  imports: [
    CommonModule,
    UnitTwoRoutingModule, SharedModule
  ]
})
export class UnitTwoModule { }
