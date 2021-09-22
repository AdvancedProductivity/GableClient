import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../Result';
import {UnitResponse} from '../UnitMenu';

@Injectable({
  providedIn: 'root'
})
export class GableBackendService {
  private prefix = '/';
  constructor(private httpClient: HttpClient) {
    let s = localStorage.getItem('host');
    if (s === null || s === undefined || s.length === 0) {
      s = '/';
    }
    if (!s.endsWith('/')) {
      s += '/';
    }
    this.prefix = s;
  }

  getServer(): string {
    return this.prefix;
  }

  public setServer(host: string): boolean{
    if (host === undefined || host === null || host.length == 0) {
      return false;
    }
    if (!host.endsWith('/')) {
      host += '/';
    }
    localStorage.setItem('host', host);
    this.prefix = host;
    return true;
  }

  public getBackendLanguage(): Observable<string> {
    return this.httpClient.get(this.prefix + 'api/test/language', {
      responseType: 'text'
    });
  }

  public getGableConfig(): Observable<any> {
    return this.httpClient.get(this.prefix + 'api/GableConfig');
  }

  public updateGableConfig(config: any): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/GableConfig', config);
  }

  public getSampleGroovyCode(): Observable<string> {
    return this.httpClient.get(this.prefix + 'api/SampleCode', {
      responseType: 'text'
    });
  }

  public runGroovySampleCode(codeContent: string): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/SampleCode', codeContent);
  }

  public getUnitMenu(): Observable<Result<UnitResponse>> {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/menu');
  }

  public addGroup(value: string): Observable<Result<UnitResponse>>  {
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/menu/group', value);
  }

  public addTest(group: string, t: string, name: string): Observable<Result<UnitResponse>> {
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/menu/unit', name, {
      params: {
        groupUuid: group,
        type: t
      }
    });
  }

  getUnitConfig(id: string): Observable<Result<any>>  {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit', {
      params: {
        uuid: id
      }
    });
  }
}
