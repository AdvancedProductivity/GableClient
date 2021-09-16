import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitIndexComponent } from '../unit/unit-index/unit-index.component';
import {UnitRoutingModule} from './unit-routing.module';

@NgModule({
  declarations: [
    UnitIndexComponent
  ],
  imports: [
    CommonModule, UnitRoutingModule
  ]
})
export class UnitModule { }
