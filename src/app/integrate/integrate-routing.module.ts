import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {IntegrateIndexComponent} from './integrate-index/integrate-index.component';

const routes: Routes = [
  {
    path: 'integrate',
    component: IntegrateIndexComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrateRoutingModule {}
