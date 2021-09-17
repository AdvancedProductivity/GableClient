import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import {IntegrateRoutingModule} from './integrate/integrate-routing.module';
import {UnitRoutingModule} from './unit/unit-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'unit',
    pathMatch: 'full'
  },
  {
    path: 'integrate',
    redirectTo: 'integrate',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy', useHash: true})
    , IntegrateRoutingModule
    , UnitRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
