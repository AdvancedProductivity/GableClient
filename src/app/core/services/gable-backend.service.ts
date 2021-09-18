import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GableBackendService {

  constructor(private httpClient: HttpClient) { }

  public getBackendLanguage(): Observable<string> {
    return this.httpClient.get('/api/test/language', {
      responseType: 'text'
    });
  }
}
