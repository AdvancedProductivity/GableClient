import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrateIndexComponent } from '../integrate/integrate-index/integrate-index.component';
import {IntegrateRoutingModule} from './integrate-routing.module';
import {SharedModule} from '../shared/shared.module';
import { IntegrateListComponent } from '../integrate/integrate-list/integrate-list.component';
import { IntegrateAddComponent } from '../integrate/integrate-add/integrate-add.component';
import { IntegrateRunComponent } from '../integrate/integrate-run/integrate-run.component';

@NgModule({
  declarations: [
    IntegrateIndexComponent,
    IntegrateListComponent,
    IntegrateAddComponent,
    IntegrateRunComponent
  ],
  imports: [
    CommonModule, IntegrateRoutingModule, SharedModule
  ]
})
export class IntegrateModule { }
