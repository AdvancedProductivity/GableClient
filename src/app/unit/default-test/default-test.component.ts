import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {UpdateOrPushInfo} from '../../core/Result';

@Component({
  selector: 'app-default-test',
  templateUrl: './default-test.component.html',
  styles: [
    `
      .content-resize-line {
        width: 100%;
        height: 5px;
        border-bottom: 1px solid #e8e8e8;
      }
    `
  ]
})
export class DefaultTestComponent implements OnInit {
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
    this.gableBackendService.runUnit(this.configJson, this.uuid, this.type, this.isPublicUnit).subscribe((res: any) => {
      this.isRunning = false;
      if (this.type === 'HTTP' && res.result && res.data.code === 200 && (typeof res.data.content === 'string')
        && res.data.contentType.startsWith('text/json')) {
        this.responseJson = JSON.stringify(JSON.parse(res.data.content), null, '\t');
      } else {
        this.responseJson = JSON.stringify(res.data, null, '\t');
      }
    }, error => {
      this.isRunning = false;
      this.responseJson = JSON.stringify(error, null, '\t');
    });
  }

  update() {
    this.gableBackendService.updateConfig(this.uuid, this.configJson).subscribe((res) => {
      if (res.result) {
        this.messageService.success('Update success');
      }
    });
  }

  changeEnv() {
    this.getConfig(false);
  }

  initEditor(editor: MonacoStandaloneCodeEditor): void {
    this.configEditor = editor;
  }

  setConfigReadOnly(isReadOnly) {
    if (this.configEditor === undefined) {
      return;
    }
    this.configEditor.updateOptions({readOnly: isReadOnly});
  }

  getConfig(isSetEnv: boolean = true) {
    this.gableBackendService.getUnitConfig(this.uuid, this.isPublicUnit, this.selectEnvUuid).subscribe((res) => {
      if (this.isPublicUnit || res.data.isUnmodify) {
        this.setConfigReadOnly(true);
      } else {
        this.setConfigReadOnly(false);
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
