import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective],
  imports: [CommonModule,
    TranslateModule,
    NzButtonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule],
  exports: [TranslateModule, WebviewDirective,
    NzButtonModule,
    FormsModule]
})
export class SharedModule {
}
