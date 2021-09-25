import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {IntegrateListComponent} from './integrate-list/integrate-list.component';
import {IntegrateAddComponent} from './integrate-add/integrate-add.component';
import {IntegrateRunComponent} from './integrate-run/integrate-run.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: './integrate' },
  {
    path: 'integrate',
    component: IntegrateListComponent
  },
  {
    path: 'integrate-add',
    component: IntegrateAddComponent
  },
  {
    path: 'integrate-run',
    component: IntegrateRunComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrateRoutingModule {}
