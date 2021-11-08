import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CliIndexComponent} from './cli-index/cli-index.component';

const routes: Routes = [
  { path: 'cli',
    component:CliIndexComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CliRoutingModule {
}
