import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {NzMessageService} from 'ng-zorro-antd/message';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {UpdateOrPushInfo} from "../../core/Result";

@Component({
  selector: 'app-groovy-unit',
  templateUrl: './groovy-unit.component.html',
  styles: [
  ]
})
export class GroovyUnitComponent implements OnInit {
  @Input() height = 500;
  @Input() uuid = '';
  @Output() updateOrPush = new EventEmitter<UpdateOrPushInfo>();
  id = -1;
  isPublicUnit = false;
  contentHeight =350;
  type = '';
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  groovyConfig = {
    theme: 'vs-light', language: 'groovy', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  response = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  configJson = `
  {
    "a": 10
  }
  `;
  responseJson = `
  "not run"
  `;
  isRunning = false;
  envs = [];
  selectEnvUuid = '';
  configEditor: MonacoStandaloneCodeEditor | undefined;
  groovyCideEditor: MonacoStandaloneCodeEditor | undefined;
  groovyCode = '';
  canPush = false;
  fromUuid = '';
  constructor(private messageService: NzMessageService,
              private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
    if (this.uuid !== undefined) {
      this.isPublicUnit = this.uuid.startsWith('public_');
      this.getConfig();
    }
  }

  updateToPublic() {
    const info: UpdateOrPushInfo = {
      type: 'UPDATE',
      from: this.uuid,
      to: this.fromUuid,
      toGroup: ''
    };
    this.updateOrPush.emit(info);
  }

  pushToPublic() {
    const info: UpdateOrPushInfo = {
      type: 'PUSH',
      from: this.uuid,
      to: '',
      toGroup: ''
    };
    this.updateOrPush.emit(info);
  }

  onContentResize({height}: NzResizeEvent) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentHeight = height;
    });
  }

  run() {
    this.isRunning = true;
    this.gableBackendService.runUnit(this.configJson, this.uuid, this.type, this.isPublicUnit,
      this.groovyCode).subscribe((res: any) => {
      this.isRunning = false;
      this.responseJson = JSON.stringify(res.data, null, '\t');
    }, error => {
      this.isRunning = false;
      this.responseJson = JSON.stringify(error, null, '\t');
    });
  }

  update() {
    this.gableBackendService.updateConfig(this.uuid, this.configJson).subscribe((res) => {
      if (res.result) {
        this.messageService.success('Update Config success');
      }
    });
    this.gableBackendService.updateGroovyCode(this.uuid, this.groovyCode).subscribe((res) => {
      if (res.result) {
        this.messageService.success('Update Code success');
      }
    });
  }

  changeEnv() {
    this.getConfig(false);
  }

  initEditor(editor: MonacoStandaloneCodeEditor): void {
    this.configEditor = editor;
  }

  initGroovyEditor(editor: MonacoStandaloneCodeEditor): void {
    this.groovyCideEditor = editor;
  }

  setConfigReadOnly(isReadOnly) {
    console.log('is read', isReadOnly);
    if (this.configEditor !== undefined) {
      this.configEditor.updateOptions({readOnly: isReadOnly});
    }
    if (this.groovyCideEditor !== undefined) {
      this.groovyCideEditor.updateOptions({readOnly: isReadOnly});
    }
  }

  private getConfig(isSetEnv: boolean = true) {
    this.gableBackendService.getUnitConfig(this.uuid, this.isPublicUnit, this.selectEnvUuid).subscribe((res) => {
      if (this.isPublicUnit || res.data.isUnmodify) {
        this.groovyConfig = {...this.groovyConfig, readOnly: true};
        this.config = {...this.config, readOnly: true};
      } else {
        this.groovyConfig = {...this.groovyConfig, readOnly: false};
        this.config = {...this.config, readOnly: false};
      }
      this.canPush = (res.data.from === undefined);
      if (!this.canPush) {
        this.fromUuid = res.data.from;
      }
      this.type = res.data.type;
      this.configJson = JSON.stringify(res.data.config, null, '\t');
      // set env select
      if (isSetEnv) {
        this.setEnv(res.data.type);
      }
    });
    this.gableBackendService.getUnitGroovyCode(this.uuid, this.isPublicUnit).subscribe((res) => {
      this.groovyCode = res;
    });
  }

  private setEnv(envTypeName: string) {
    const defaultConfig = {name: 'Un Select', uuid: ''};
    const envArrays = this.gableBackendService.getEnvs();
    const arr = [];
    arr.push(defaultConfig);
    if (envArrays !== undefined) {
      envArrays.forEach((value) => {
        arr.push(value);
      });
    }
    this.envs = arr;
  }
}
