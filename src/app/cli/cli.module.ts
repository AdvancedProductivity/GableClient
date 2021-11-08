import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CliIndexComponent } from './cli-index/cli-index.component';
import {CliRoutingModule} from './cli-routing.module';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [
    CliIndexComponent
  ],
  imports: [
    CommonModule,
    CliRoutingModule, SharedModule
  ]
})
export class CliModule { }
