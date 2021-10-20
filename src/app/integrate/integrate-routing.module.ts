import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {IntegrateListComponent} from './integrate-list/integrate-list.component';
import {IntegrateAddComponent} from './integrate-add/integrate-add.component';
import {IntegrateRunComponent} from './integrate-run/integrate-run.component';
import {IntegrateIndexComponent} from './integrate-index/integrate-index.component';

const routes: Routes = [
  { path: 'integrate',
    component: IntegrateIndexComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: IntegrateListComponent
      },
      {
        path: 'add',
        component: IntegrateAddComponent
      },
      {
        path: 'run',
        component: IntegrateRunComponent
      }
    ],
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrateRoutingModule {}
