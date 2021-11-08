import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import {IntegrateRoutingModule} from './integrate/integrate-routing.module';
import {UnitRoutingModule} from './unit/unit-routing.module';
import {AppComponent} from './app.component';
import {CliRoutingModule} from './cli/cli-routing.module';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', loadChildren: () => import('./unit/unit.module').then((m) => m.UnitModule) },
      { path: 'cli', loadChildren: () => import('./cli/cli.module').then((m) => m.CliModule) },
      { path: 'integrate', loadChildren: () => import('./integrate/integrate.module').then((m) => m.IntegrateModule) }
    ],
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
    , CliRoutingModule
    , UnitRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
