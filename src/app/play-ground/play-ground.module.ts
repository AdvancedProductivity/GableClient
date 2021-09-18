import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayGroundDrawerIndexComponent } from './play-ground-drawer-index/play-ground-drawer-index.component';
import { SampleGroovyRunningComponent } from '../play-ground/sample-groovy-running/sample-groovy-running.component';
import {SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [
    PlayGroundDrawerIndexComponent,
    SampleGroovyRunningComponent
  ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class PlayGroundModule { }
