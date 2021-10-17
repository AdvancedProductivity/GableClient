import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitIndexComponent } from './unit-index/unit-index.component';
import {UnitRoutingModule} from './unit-routing.module';
import {SharedModule} from '../shared/shared.module';
import { UnitDashboardComponent } from './unit-dashboard/unit-dashboard.component';
import { DefaultTestComponent } from './default-test/default-test.component';
import { CaseManagerComponent } from '../unit/case-manager/case-manager.component';
import { GroovyUnitComponent } from '../unit/groovy-unit/groovy-unit.component';
@NgModule({
  declarations: [
    UnitIndexComponent,
    UnitDashboardComponent,
    DefaultTestComponent,
    CaseManagerComponent,
    GroovyUnitComponent
  ],
  imports: [
    CommonModule, UnitRoutingModule, SharedModule
  ]
})
export class UnitModule { }
