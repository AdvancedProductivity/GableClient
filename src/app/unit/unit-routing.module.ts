import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {UnitIndexComponent} from './unit-index/unit-index.component';

const routes: Routes = [
  {
    path: 'unit',
    component: UnitIndexComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitRoutingModule {}
