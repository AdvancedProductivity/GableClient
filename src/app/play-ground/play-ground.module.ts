import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayGroundDrawerIndexComponent } from './play-ground-drawer-index/play-ground-drawer-index.component';
import { SampleGroovyRunningComponent } from '../play-ground/sample-groovy-running/sample-groovy-running.component';
import {SharedModule} from '../shared/shared.module';
import { JsonSchemaValidateComponent } from './json-schema-validate/json-schema-validate.component';
import {InterpolationExpressionComponent} from './interpolation-expression/interpolation-expression.component';
import { PreScriptComponent } from './pre-script/pre-script.component';



@NgModule({
  declarations: [
    PlayGroundDrawerIndexComponent,
    SampleGroovyRunningComponent,
    JsonSchemaValidateComponent,
    InterpolationExpressionComponent,
    PreScriptComponent
  ],
  imports: [
    CommonModule, SharedModule
  ]
})
export class PlayGroundModule { }
