import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';

import {AppRoutingModule} from './app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


import {AppComponent} from './app.component';
import {SettingModule} from './setting/setting.module';
import {PlayGroundModule} from './play-ground/play-ground.module';
import {UnitModule} from './unit/unit.module';
import {IntegrateModule} from './integrate/integrate.module';
import {RouteReuseStrategy} from '@angular/router';
import {AppRoutingCache} from './core/AppRoutingCache';
import {MONACO_PATH} from '@materia-ui/ngx-monaco-editor';
import {HttpI18nInterceptor} from './core/HttpI18nInterceptor';
import {CliModule} from './cli/cli.module';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');

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
    CliModule,
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
  providers: [{provide: RouteReuseStrategy, useClass: AppRoutingCache}
    , {
      provide: MONACO_PATH,
      useValue: 'https://unpkg.com/monaco-editor@0.25.2/min/vs'
    }
    , {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpI18nInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
