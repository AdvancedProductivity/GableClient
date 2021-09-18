import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  public getGableConfig(): Observable<any> {
    return this.httpClient.get('api/GableConfig');
  }

  public updateGableConfig(config: any): Observable<any> {
    return this.httpClient.post('api/GableConfig', config);
  }
}
