import {Component, Input, OnInit} from '@angular/core';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {TranslateService} from '@ngx-translate/core';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pre-script',
  templateUrl: './pre-script.component.html',
  styles: [
  ]
})
export class PreScriptComponent implements OnInit {
  @Input() isPre = true;
  @Input() leftTip = '';
  @Input() rightTip = '';
  height = 450;
  groovyCode = '';
  param = '';
  leftEditor: MonacoStandaloneCodeEditor | undefined;
  rightEditor: MonacoStandaloneCodeEditor | undefined;
  leftConfig = {
    theme: 'vs-light', language: 'java', fontSize: 14, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  rightConfig = {
    theme: 'vs-light', language: 'json', fontSize: 14, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  isHandlingData = false;
  isShowAddGroup = false;
  isShowAddItem = false;
  editingGroupName = '';
  selectedGroupUuid = '';
  group = [];
  menu = [];
  handlingUuid = '';
  handlingName = '';
  isShowDiff = false;
  originalCode = '';
  modifiedCode = '';
  diffConfig = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  postValidateResult = '';
  constructor(private gableBackendService: GableBackendService,
              private translate: TranslateService,
              private messageService: NzMessageService) { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 55 - 24 - 46 - 16 - 32 - 48 -43;
    this.getMenu();
    this.getDefaultCode();
  }

  execute() {
    this.isHandlingData = true;
    try {
      const data = JSON.parse(this.param);
      data.code = this.groovyCode;
      this.gableBackendService.executeScript(this.isPre, this.handlingUuid, data).subscribe((res) => {
        if (res.result){
          if (this.isPre) {
            this.originalCode = JSON.stringify(data.in, null, '\t');
            this.modifiedCode = JSON.stringify(res.data.in, null, '\t');
            this.isShowDiff = true;
            localStorage.setItem('PreGroovyScript', this.param);
          }else {
            this.originalCode = JSON.stringify(data.out, null, '\t');
            this.modifiedCode = JSON.stringify(res.data.out, null, '\t');
            this.isShowDiff = true;
            localStorage.setItem('PostGroovyScript', this.param);
          }
        }else {
          this.messageService.error(res.message, {nzDuration: 3500});
        }
        this.isHandlingData = false;
      }, error => {
        this.isHandlingData = false;
        this.messageService.error('error happens' + error.message, {nzDuration: 3500});
      });
    } catch (e){
      this.isHandlingData = false;
      this.messageService.error('json format error' + e.message, {nzDuration: 3500});
    }
  }

  initLeftEditor(editor: MonacoStandaloneCodeEditor): void {
    this.leftEditor = editor;
  }

  initRightEditor(editor: MonacoStandaloneCodeEditor): void {
    this.rightEditor = editor;
  }

  format() {
    if (this.rightEditor === undefined) {
      return;
    }else {
      this.rightEditor.getAction('editor.action.formatDocument').run();
    }
  }

  addGroup() {
    this.editingGroupName = '';
    this.isShowAddGroup = true;
  }

  addScriptDialog() {
    this.editingGroupName = '';
    this.selectedGroupUuid = '';
    this.isShowAddItem = true;
  }

  addGroupToServer() {
    this.gableBackendService.addScriptGroup(this.isPre, this.editingGroupName).subscribe((res) => {
      if (res.result) {
        this.resetMenu(res);
        this.isShowAddGroup = false;
      }else {
        this.messageService.error(res.message, {nzDuration: 3500});
      }
    });
  }

  addScript() {
    this.gableBackendService.addScript(this.isPre, this.editingGroupName, this.selectedGroupUuid).subscribe((res) => {
      if (res.result) {
        this.resetMenu(res);
        this.isShowAddItem = false;
      }else {
        this.messageService.error(res.message, {nzDuration: 3500});
      }
    });
  }

  showDetail(uuid: string, unitName: string) {
    this.handlingUuid = uuid;
    this.handlingName = unitName;
    this.gableBackendService.getScriptCode(uuid).subscribe((res) => {
      this.groovyCode = res.data;
    });
  }

  update() {
    this.gableBackendService.updateScriptCode(this.handlingUuid, this.groovyCode).subscribe((res) => {
      this.messageService.success('Update Success');
    });
  }

  private getMenu() {
    this.gableBackendService.getScriptList(this.isPre).subscribe((res) => {
      if (res.result) {
        this.resetMenu(res);
      }
    });
  }

  private getDefaultCode() {
    if (this.isPre) {
      const existCode = localStorage.getItem('PreGroovyScript');
      if (existCode === undefined || existCode === null || existCode.length === 0) {
        this.param = `
      {
        "in": {},
        "instance":{},
        "global":{}
      }
      `;
      }else {
        this.param = existCode;
      }
    }else {
      const existCode = localStorage.getItem('PostGroovyScript');
      if (existCode === undefined || existCode === null || existCode.length === 0) {
        this.param = `
      {
        "out": {
          "validate" : {
            "passed" : true,
            "jsonSchema" : [ ]
          }
        },
        "param":{},
        "instance":{},
        "global":{}
      }
      `;
      }else {
        this.param = existCode;
      }
    }
  }

  private resetMenu(res: any) {
    this.menu = [];
    this.group = [];
    res.data.forEach(value => {
      this.group.push({
        key: value.groupName,
        value: value.uuid
      });
    });
    this.menu = res.data;
    this.handlingUuid = '';
    this.handlingName = '';
    this.groovyCode = '';
    this.originalCode = '';
    this.modifiedCode = '';
  }
}
