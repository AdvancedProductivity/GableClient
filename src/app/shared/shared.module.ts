import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {PageNotFoundComponent} from './components/';
import {WebviewDirective} from './directives/';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzResizableModule} from 'ng-zorro-antd/resizable';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzAlertModule} from 'ng-zorro-antd/alert';
// import { NzCardModule } from 'ng-zorro-antd/card';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {MonacoEditorModule} from '@materia-ui/ngx-monaco-editor';
import {NzInputModule} from 'ng-zorro-antd/input';
import {AddGroupOrUnitTestComponent} from './add-group-or-unit-test/add-group-or-unit-test.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, AddGroupOrUnitTestComponent],
  imports: [CommonModule,
    TranslateModule,
    // NzCardModule,
    NzModalModule,
    NzResizableModule,
    NzTabsModule,
    NzSpinModule,
    NzIconModule,
    NzAlertModule,
    NzTableModule,
    NzRadioModule,
    NzFormModule,
    NzUploadModule,
    NzLayoutModule,
    NzSelectModule,
    NzGridModule,
    NzMessageModule,
    NzInputModule,
    MonacoEditorModule,
    NzButtonModule,
    NzDrawerModule,
    BrowserModule,
    NzDropDownModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [TranslateModule, WebviewDirective,
    NzLayoutModule,
    NzDrawerModule,
    NzDropDownModule,
    NzTableModule,
    NzSpinModule,
    NzModalModule,
    NzIconModule,
    NzAlertModule,
    NzUploadModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzMessageModule,
    MonacoEditorModule,
    NzResizableModule,
    NzTabsModule,
    NzRadioModule,
    NzGridModule,
    // NzCardModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    AddGroupOrUnitTestComponent
  ]
})
export class SharedModule {
}
