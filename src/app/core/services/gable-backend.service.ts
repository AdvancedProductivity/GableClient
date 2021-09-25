import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Result} from '../Result';
import {UnitResponse} from '../UnitMenu';

@Injectable({
  providedIn: 'root'
})
export class GableBackendService {
  private prefix = '/';
  private envMap = new Map();
  constructor(private httpClient: HttpClient) {
    let s = localStorage.getItem('host');
    if (s === null || s === undefined || s.length === 0) {
      s = '/';
    }
    if (!s.endsWith('/')) {
      s += '/';
    }
    this.prefix = s;
    const envStr = localStorage.getItem('env');
    if (envStr != null && envStr.length > 0) {
      this.setEnv(JSON.parse(envStr));
    }
  }

  getServer(): string {
    return this.prefix;
  }

  public setEnv(envs: any){
    this.envMap.clear();
    envs.forEach(value => {
      this.envMap.set(value.typeName, value.configs);
    });
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

  public getUnitConfig(id: string, isPub: boolean): Observable<Result<any>>  {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit', {
      params: {
        uuid: id,
        isPublic: isPub
      }
    });
  }

  public updateConfig(id: string, body: string): Observable<Result<any>>  {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/unit', body, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        uuid: id
      }
    });
  }

  public getUnitConfigOfCase(id: string, isPub: boolean, caseID: string, version: number): Observable<Result<any>> {
    let p = {};
    if (caseID === undefined || version === undefined) {
      p = {
        uuid: id,
        isPublic: isPub
      };
    }else {
      p = {
        uuid: id,
        caseId: caseID,
        caseVersion: version,
        isPublic: isPub
      };
    }
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit', {
      params: p
    });
  }

  public getUnitHistory(id: string, isPub: boolean, history: number): Observable<Result<any>> {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit/history', {
      params: {
        uuid: id,
        isPublic: isPub,
        historyId: history
      }
    });
  }

  getIntegrateHistory(id: any, hisId: any) {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/integrate/history', {
      params: {
        uuid: id,
        historyId: hisId
      }
    });
  }

  public runUnit(config: string, id: string, testType: string, isPub: boolean): Observable<Result<any>> {
    const data = {
      config: undefined,
      instance: undefined
    };
    try {
      data.config = JSON.parse(config);
      data.instance = {};
    } catch (e){
      console.log(e);
    }
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/unit/run', data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        uuid: id,
        type: testType,
        isPublic: isPub
      }
    });
  }

  public getEnv(): Observable<any>  {
    return this.httpClient.get<any>(this.prefix + 'api/env');
  }

  public addEnv(config: string, envName: string, envType: string) {
    return this.httpClient.post<Result<any>>(this.prefix + 'api/env', config, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        name: envName,
        type: envType
      }
    });
  }

  public updateEnv(config: string, envName: string, envUuid: string) {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/env', config, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        name: envName,
        uuid: envUuid
      }
    });
  }

  public getEnvDetail(id: string): Observable<any>  {
    return this.httpClient.get<any>(this.prefix + 'api/env/detail', {
      params: {
        uuid: id
      }
    });
  }

  public getCase(id: string, isPub: boolean) {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/case', {
      params: {
        uuid: id,
        isPublic: isPub
      }
    });
  }

  getOneCase(id: string, isPub: boolean, currentVersion: number, caseID: string) {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/case/item', {
      params: {
        uuid: id,
        caseId: caseID,
        isPublic: isPub,
        version: currentVersion
      }
    });
  }

  updateCase(id: string, isPub: boolean, currentVersion: number, caseID: string, diffStr: any, jsonSchemaStr: any) {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/case', {diff:diffStr, jsonSchema: jsonSchemaStr}, {
      params: {
        uuid: id,
        caseId: caseID,
        isPublic: isPub,
        version: currentVersion
      }
    });
  }

  getIntegrate() {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/integrate');
  }

  addIntegrate(waitForSave: any[], testName: string) {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/integrate', waitForSave, {
      params:{
        name: testName
      }
    });
  }

  getIntegrateDetail(enterId: string) {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/integrate/detail', {
      params: {
        uuid: enterId
      }
    });
  }

  addIntegrateHistory(integrateUuid: string, record: any[]) {
    return this.httpClient.post<Result<any>>(this.prefix + 'api/integrate/addHistory', record, {
      params:{
        uuid: integrateUuid
      }
    });
  }
}
