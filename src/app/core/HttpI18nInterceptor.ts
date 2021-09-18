import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpI18nInterceptor implements HttpInterceptor {

  constructor(private translate: TranslateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('./assets')) {
      const langReq = req.clone({
        headers: req.headers.set('Accept-Language', this.translate.getDefaultLang())
      });
      return next.handle(langReq);
    }
    return next.handle(req);
  }
}
