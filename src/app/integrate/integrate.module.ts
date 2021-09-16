import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrateIndexComponent } from '../integrate/integrate-index/integrate-index.component';
import {IntegrateRoutingModule} from './integrate-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    IntegrateIndexComponent
  ],
  imports: [
    CommonModule, IntegrateRoutingModule, SharedModule
  ]
})
export class IntegrateModule { }
