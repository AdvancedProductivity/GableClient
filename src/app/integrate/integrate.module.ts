import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrateIndexComponent } from '../integrate/integrate-index/integrate-index.component';
import {IntegrateRoutingModule} from './integrate-routing.module';

@NgModule({
  declarations: [
    IntegrateIndexComponent
  ],
  imports: [
    CommonModule, IntegrateRoutingModule
  ]
})
export class IntegrateModule { }
