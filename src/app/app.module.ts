import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppComponent } from './app.component';
import {SettingModule} from './setting/setting.module';
import {PlayGroundModule} from './play-ground/play-ground.module';
import {UnitModule} from './unit/unit.module';
import {IntegrateModule} from './integrate/integrate.module';
import {RouteReuseStrategy} from '@angular/router';
import {AppRoutingCache} from './AppRoutingCache';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    UnitModule,
    IntegrateModule,
    SettingModule,
    PlayGroundModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: AppRoutingCache }],
  bootstrap: [AppComponent]
})
export class AppModule {}
