import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
// import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {NzModalModule} from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [CommonModule,
    TranslateModule,
    // NzCardModule,
    NzModalModule,
    NzIconModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule],
  exports: [TranslateModule, WebviewDirective,
    NzLayoutModule,
    NzModalModule,
    NzIconModule,
    NzGridModule,
    // NzCardModule,
    NzButtonModule,
    FormsModule]
})
export class SharedModule {
}
