import {Component, Input, OnInit} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzUploadChangeParam} from 'ng-zorro-antd/upload';
import {ElectronService} from '../../core/services';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-case-manager',
  templateUrl: './case-manager.component.html',
  styles: [
  ]
})
export class CaseManagerComponent implements OnInit {
  @Input() uuid = '';
  height = 800;
  isPublicUnit = false;
  uploadPath = '';
  headers = [];
  records = [];
  currentVersion = 0;
  isShowDetail = false;
  canUpdate = true;
  leftTip =  'Diff';
  rightTip = 'JsonSchema';
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  rightStr = '';
  leftStr = '';
  isHandlingData = false;
  selectId = '';
  testType = '';
  isElectron = false;
  leftEditor: MonacoStandaloneCodeEditor | undefined;
  rightEditor: MonacoStandaloneCodeEditor | undefined;
  isShowAllField = false;
  inStr = undefined;
  allFieldStr = undefined;
  jsonSchemaStr = '';
  isShowJsonSchema = false;
  constructor(private gableBackendService: GableBackendService,
              private electronService: ElectronService,
              private msg: NzMessageService) {
  }

  ngOnInit(): void {
    this.isElectron = this.electronService.isElectron;

    this.height = document.documentElement.clientHeight - 56 - 46 - 16;
    this.isPublicUnit = this.uuid.startsWith('public_');
    this.uploadPath = this.gableBackendService.getServer() + 'api/case/upload?uuid=' + this.uuid + '&isPublic=' + this.isPublicUnit;
    this.gableBackendService.getCase(this.uuid, this.isPublicUnit).subscribe(res => {
      if (res.result) {
        this.headers = res.data.headers;
        this.records = res.data.record;
        this.currentVersion = res.data.version;
      }
    });
  }

  handleChange(info: NzUploadChangeParam) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      console.log('file', info);
      this.headers = info.file.response.data.headers;
      this.records = info.file.response.data.record;
      this.currentVersion = info.file.response.data.version;
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  handleCancel() {
    this.isShowDetail = false;
    this.isShowAllField = false;
    this.leftStr = '';
    this.rightStr = '';
    this.selectId = '';
  }

  showDetail(id) {
    this.canUpdate = true;
    this.isShowDetail = true;
    this.isHandlingData = true;
    this.leftTip =  'Diff';
    this.rightTip = 'JsonSchema';
    this.selectId = id;
    this.gableBackendService.getOneCase(this.uuid, this.isPublicUnit, this.currentVersion, id).subscribe((res) => {
      if (res.data.diff == null){
        this.leftStr = '';
      }if (typeof res.data.diff === 'string') {
        this.leftStr = res.data.diff;
      }else {
        this.leftStr = JSON.stringify(res.data.diff, null, '\t');
      }
      if (res.data.jsonSchema == null){
        this.rightStr = '';
      }if (typeof res.data.jsonSchema === 'string') {
        this.rightStr = res.data.jsonSchema;
      }else {
        this.rightStr = JSON.stringify(res.data.jsonSchema, null, '\t');
      }
      this.isHandlingData = false;
      this.makeReadOnly(false);
    });
  }

  updateThisCase() {
    try {
      const diff = JSON.parse(this.leftStr);
      const jsonSchema = JSON.parse(this.rightStr);
      this.gableBackendService.updateCase(this.uuid, this.isPublicUnit, this.currentVersion, this.selectId, diff,
        jsonSchema).subscribe((res) => {
        if (res.result) {
          this.msg.success('update success');
        } else {
          this.msg.error('update failed');
        }
      });
    } catch (e){
      this.msg.error('json error', {nzDuration: 3000});
    }
  }

  runCase(id) {
    this.canUpdate = false;
    this.isShowDetail = true;
    this.isHandlingData = true;
    this.leftTip =  'IN';
    this.rightTip = 'OUT';
    this.selectId = id;
    this.gableBackendService.getUnitConfigOfCase(this.uuid, this.isPublicUnit, id + '', this.currentVersion).subscribe((configRes) => {
      this.testType = configRes.data.type;
      this.leftStr = JSON.stringify(configRes.data.config, null, '\t');
      this.gableBackendService.runUnit(this.leftStr, this.uuid, this.testType, this.isPublicUnit).subscribe((out: any) => {
        if (this.testType === 'HTTP' && out.result && out.data.code === 200 && (typeof out.data.content === 'string')) {
          this.rightStr = JSON.stringify(JSON.parse(out.data.content), null, '\t');
        } else {
          this.rightStr = JSON.stringify(out.data, null, '\t');
        }
        this.isHandlingData = false;
      }, error => {
        this.rightStr = JSON.stringify(error, null, '\t');
        this.isHandlingData = false;
      });
      this.makeReadOnly(true);
    });
  }

  gotoModify() {
    this.showDetail(this.selectId);
  }

  export() {
    if (this.isElectron) {
      return;
    }
    window.open(this.gableBackendService.getServer() + 'api/case/export?uuid=' + this.uuid + '&isPublic=' + this.isPublicUnit, '_blank');
  }

  exportAsJson() {
    if (this.isElectron) {
      return;
    }
    window.open(this.gableBackendService.getServer() + 'api/case/exportAsJson?uuid=' + this.uuid + '&isPublic=' + this.isPublicUnit, '_blank');
  }

  format() {
    if (this.leftEditor === undefined) {
      return;
    }else {
      this.leftEditor.getAction('editor.action.formatDocument').run();
    }
    if (this.rightEditor === undefined) {
      return;
    }else {
      this.rightEditor.getAction('editor.action.formatDocument').run();
    }
  }
  initLeftEditor(editor: MonacoStandaloneCodeEditor): void {
    this.leftEditor = editor;
  }
  initRightEditor(editor: MonacoStandaloneCodeEditor): void {
    this.rightEditor = editor;
  }

  makeReadOnly(isReadOnly: boolean) {
    if (this.leftEditor === undefined) {
      return;
    } else {
      this.leftEditor.updateOptions({readOnly: isReadOnly});
    }
    if (this.rightEditor === undefined) {
      return;
    } else {
      this.rightEditor.updateOptions({readOnly: isReadOnly});
    }
  }

  showAllField() {
    if (this.allFieldStr !== undefined) {
      this.isShowAllField = true;
      this.leftStr = this.inStr;
      this.rightStr = this.allFieldStr;
      this.leftTip = 'in';
      this.rightTip = 'all fields';
      this.isShowDetail = true;
      return;
    }
    this.gableBackendService.getAllFieldInfo(this.uuid, this.isPublicUnit).subscribe((out: any) => {
      this.allFieldStr = JSON.stringify(out.data.allField, null, '\t');
      this.inStr = JSON.stringify(out.data.in, null, '\t');
      this.showAllField();
    }, error => {
    });
  }

  generateJsonSchema() {
    this.gableBackendService.generateJsonShema(this.rightStr, this.testType).subscribe((out: any) => {
      this.jsonSchemaStr = JSON.stringify(out.data, null, '\t');
      this.isShowJsonSchema = true;
    }, error => {
    });
  }
}
