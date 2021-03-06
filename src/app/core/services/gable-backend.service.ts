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
  private envMap = [];

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

  public setEnv(envs: any) {
    this.envMap = envs;
    localStorage.setItem('env', JSON.stringify(this.envMap));
  }

  public getEnvs() {
    return this.envMap;
  }

  public setServer(host: string): boolean {
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

  public addGroup(value: string, typeName: string): Observable<Result<UnitResponse>> {
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/menu/group', value, {
      params: {
        type: typeName
      }
    });
  }

  public addTest(group: string, t: string, name: string): Observable<Result<UnitResponse>> {
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/menu/unit', name, {
      params: {
        groupUuid: group,
        type: t
      }
    });
  }

  public getUnitConfig(id: string, isPub: boolean, envUuid: string = ''): Observable<Result<any>> {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit', {
      params: {
        uuid: id,
        isPublic: isPub,
        env: envUuid,
      }
    });
  }

  public updateConfig(id: string, body: string): Observable<Result<any>> {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/unit', body, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        uuid: id
      }
    });
  }

  public getUnitConfigOfCase(id: string, isPub: boolean, caseID: string, version: number, envUuid: string = ''): Observable<Result<any>> {
    let p = {};
    if (caseID === undefined || version === undefined) {
      p = {
        uuid: id,
        env: envUuid,
        isPublic: isPub
      };
    } else {
      p = {
        uuid: id,
        caseId: caseID,
        env: envUuid,
        caseVersion: version,
        isPublic: isPub
      };
    }
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit', {
      params: p
    });
  }

  public getDiffOfCase(id: string, isPub: boolean, caseID: string, version: number, envUuid: string = ''): Observable<Result<any>> {
    let p = {};
    if (caseID === undefined || version === undefined) {
      p = {
        uuid: id,
        env: envUuid,
        isPublic: isPub
      };
    } else {
      p = {
        uuid: id,
        caseId: caseID,
        env: envUuid,
        caseVersion: version,
        isPublic: isPub
      };
    }
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/unit/diff', {
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

  public getGroovyHistory(id: string, isPub: boolean, history: number): Observable<Result<any>> {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/groovyCode/history', {
      params: {
        uuid: id,
        isPublic: isPub,
        historyId: history
      }
    });
  }

  public getJsonSchemaHistory(id: string, isPub: boolean, history: number): Observable<Result<any>> {
    return this.httpClient.get<Result<UnitResponse>>(this.prefix + 'api/jsonSchema/history', {
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

  public runUnit(config: string, id: string, testType: string, isPub: boolean, groovyCode: string = '',
                 insVar: any = {}): Observable<Result<any>> {
    const data = {
      config: undefined,
      instance: undefined
    };
    console.log('test type', testType);
    try {
      data.config = JSON.parse(config);
      if (testType === 'GROOVY_SCRIPT') {
        data.config.groovyCode = groovyCode;
        data.config.groovyTestUuid = id;
      }
      data.instance = insVar;
    } catch (e) {
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

  public runStep(nIn: any, lOut: any, ins: any, id: string): Observable<Result<any>> {
    const data = {
      lastOut: lOut,
      instance: ins,
      nextIn: nIn
    };
    if (typeof(nIn) == 'string'){
      try {
        data.nextIn = JSON.parse(nIn);
      } catch (e) {
        console.log(e);
      }
    }
    return this.httpClient.post<Result<UnitResponse>>(this.prefix + 'api/groovyCode', data, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        uuid: id
      }
    });
  }

  public getEnv(): Observable<any> {
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

  public getEnvDetail(id: string): Observable<any> {
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
    return this.httpClient.put<Result<any>>(this.prefix + 'api/case', {diff: diffStr, jsonSchema: jsonSchemaStr}, {
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

  getIntegrateRunHistory(id: string) {
    return this.httpClient.get<Result<any>>(this.prefix + 'api/integrate/historyList', {
      params:{
        uuid: id
      }
    });
  }

  addIntegrate(waitForSave: any[], testName: string) {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/integrate', waitForSave, {
      params: {
        name: testName
      }
    });
  }

  updateIntegrate(waitForSave: any[], id: string) {
    return this.httpClient.post<Result<any>>(this.prefix + 'api/integrate', waitForSave, {
      params: {
        uuid: id
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

  addIntegrateHistory(integrateUuid: string, record: any[], envUuid: string) {
    return this.httpClient.post<Result<any>>(this.prefix + 'api/integrate/addHistory', record, {
      params: {
        uuid: integrateUuid,
        env: envUuid,
        server: this.getServer()
      }
    });
  }

  addTag(integrateUuid: string, name: string) {
    return this.httpClient.post<Result<any>>(this.prefix + 'api/tag', null, {
      params: {
        uuid: integrateUuid,
        tagName: name
      }
    });
  }

  public getGlobalConfig(): Observable<any> {
    return this.httpClient.get(this.prefix + 'api/global_config');
  }

  public updateGlobalConfig(config: any): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/global_config', config);
  }

  getAllFieldInfo(id: string, isPublicUnit: boolean) {
    return this.httpClient.get(this.prefix + 'api/unit/allField', {
      params: {
        uuid: id,
        isPublic: isPublicUnit
      }
    });
  }

  generateJsonSchema(jsonStr: string, testType: string) {
    return this.httpClient.post(this.prefix + 'api/jsonSchema', jsonStr, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        type: testType,
      }
    });
  }

  justGenerateJsonSchema(jsonStr: any): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/jsonSchema/just', jsonStr);
  }

  getJsonSchemaCache(): Observable<any> {
    return this.httpClient.get(this.prefix + 'api/jsonSchema');
  }

  getScriptList(isPre: boolean): Observable<any> {
    if (isPre) {
      return this.httpClient.get(this.prefix + 'api/groovyCode/preScriptList');
    }else {
      return this.httpClient.get(this.prefix + 'api/groovyCode/postScriptList');
    }
  }

  addScriptGroup(isPre: boolean, gName): Observable<any> {
    if (isPre) {
      return this.httpClient.post(this.prefix + 'api/groovyCode/preScriptGroup', null,{
        params: {
          groupName: gName
        }
      });
    }else {
      return this.httpClient.post(this.prefix + 'api/groovyCode/postScriptGroup', null, {
        params: {
          groupName: gName
        }
      });
    }
  }

  getScriptCode(id: string): Observable<any>  {
    return this.httpClient.get(this.prefix + 'api/groovyCode/readCode', {
      params: {
        uuid: id
      }
    });
  }

  updateScriptCode(id: string, groovyCode: string): Observable<any>  {
    return this.httpClient.put(this.prefix + 'api/groovyCode/updateScript', groovyCode, {
      params: {
        uuid: id
      }
    });
  }

  executeScript(isPre: boolean, id: string, data: any): Observable<any> {
    if (isPre) {
      return this.httpClient.post(this.prefix + 'api/groovyCode/executePreScript', data);
    }else {
      return this.httpClient.post(this.prefix + 'api/groovyCode/executePostScript', data);
    }
  }

  addScript(isPre: boolean, name, gUuid: string): Observable<any> {
    if (isPre) {
      const code = `
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

    handle(in,param,instance,global);

    void handle(JsonNode in,ObjectNode param, JsonNode instance, JsonNode global){

    }
    `;
      return this.httpClient.post(this.prefix + 'api/groovyCode/preScript', code, {
        params: {
          scriptName: name,
          groupUuid: gUuid
        }
      });
    } else {
      const code = `
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

    handle(out,param,instance,global);

    void handle(JsonNode out,ObjectNode param, JsonNode instance, JsonNode global){

    }
    `;
      return this.httpClient.post(this.prefix + 'api/groovyCode/postScript', code, {
        params: {
          scriptName: name,
          groupUuid: gUuid
        }
      });
    }
  }

  validateJsonSchema(param: { schema: any; json: any }): Observable<any> {
    return this.httpClient.put(this.prefix + 'api/jsonSchema', param);
  }

  public preHandle(data: any): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/jsonSchema/preHandle', data);
  }

  public updateGroovyCode(id: string, body: string): Observable<Result<any>> {
    return this.httpClient.put<Result<any>>(this.prefix + 'api/groovyCode', body, {
      params: {
        uuid: id
      }
    });
  }

  public getUnitGroovyCode(id: string, isPub: boolean): Observable<string> {
    return this.httpClient.get(this.prefix + 'api/groovyCode', {
      params: {
        uuid: id,
        isPublic: isPub
      },
      responseType: 'text'
    });
  }

  public pushUnit(param: { from: any; toGroup: string; testName: string}): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/unit/push', param);
  }

  public clone(param: { uuid: any; toGroup: string; testName: string}): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/unit/clone', param);
  }

  public updateUnit(param: { from: string; to: string}): Observable<any> {
    return this.httpClient.post(this.prefix + 'api/unit/update', param);
  }

  public deleteIntegrate(id: string): Observable<any> {
    return this.httpClient.delete(this.prefix + 'api/integrate', {
      params: {
        uuid: id
      }
    });
  }

  public entrustRun(id: string, selectEnv: string): Observable<any> {
    return this.httpClient.get(this.prefix + 'api/integrate/entrust', {
      params: {
        uuid: id,
        env: selectEnv,
        server: this.getServer()
      }
    });
  }

  public stopEntrustRun(id: string): Observable<any> {
    return this.httpClient.delete(this.prefix + 'api/integrate/entrust', {
      params: {
        uuid: id
      }
    });
  }

  getFileList(): Observable<any>{
    return this.httpClient.get(this.prefix + 'api/fileCenter');
  }

  removeFile(id: string): Observable<any> {
    return this.httpClient.delete(this.prefix + 'api/fileCenter', {
      params:{
        uuid: id
      }
    });
  }

  deleteUnitTest(id: string): Observable<any> {
    return this.httpClient.delete(this.prefix + 'api/menu', {
      params:{
        uuid: id
      }
    });
  }

  runJsonSchemaStep(lastOut: any, code: string, id: string, lastType: string) {
    const body = {
      json: lastOut,
      schema: undefined
    };
    if (lastType === 'HTTP') {
      body.json = lastOut.content;
    }
    try {
      body.schema = JSON.parse(code);
    } catch (e){
      console.error(e);
    }
    return this.httpClient.post(this.prefix + 'api/jsonSchema/run', body, {
      params: {
        uuid: id
      }
    });
  }
}
