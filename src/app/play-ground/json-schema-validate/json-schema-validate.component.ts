import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-json-schema-validate',
  templateUrl: './json-schema-validate.component.html',
  styles: [
  ]
})
export class JsonSchemaValidateComponent implements OnInit {
  height = 450;
  tip = '';
  errors = [];
  express = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 2
    },
    "testArray": {
      "type": "array",
      "minItems": 2
    }
  }
}
`;
  code = `
{
  "name": "asd",
  "testArray": [
    1
  ]
}
`;
  leftEditor: MonacoStandaloneCodeEditor | undefined;
  rightEditor: MonacoStandaloneCodeEditor | undefined;
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  isHandlingData = true;
  isShowResult = false;
  constructor(private gableBackendService: GableBackendService,
              private messageService: NzMessageService) { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 55 - 24 - 46 - 16 - 32 - 48 -43;
    this.getLastRunData();
  }

  validate() {
    this.isHandlingData = true;
    try {
      const schemaObj = JSON.parse(this.express);
      const jsonObj = JSON.parse(this.code);
      this.gableBackendService.validateJsonSchema({schema: schemaObj, json: jsonObj}).subscribe((res) => {
        if (res.result) {
          if (res.data !== undefined && res.data.length > 0) {
            this.errors = res.data;
          }else {
            this.errors = [];
            this.tip = 'validate passed';
          }
          this.messageService.success('validate passed');
        }else {
          this.tip = res.message;
          this.errors = [];
          this.messageService.error('validate error');
        }
        this.isHandlingData = false;
        this.isShowResult = true;
      },error => {
        this.tip = error.message;
        this.isHandlingData = false;
        this.errors = [];
      });
    } catch (e){
      this.isHandlingData = false;
      this.messageService.error('param error');
    }
  }

  initLeftEditor(editor: MonacoStandaloneCodeEditor): void {
    this.leftEditor = editor;
  }

  initRightEditor(editor: MonacoStandaloneCodeEditor): void {
    this.rightEditor = editor;
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

  generateForRightJson() {
    try {
      const data = JSON.parse(this.code);
      this.gableBackendService.justGenerateJsonSchema(data).subscribe((res) => {
        if (res.result) {
          this.express = JSON.stringify(res.data, null, '\t');
        }
      });
    } catch (e){
      this.messageService.error('the json format error', {nzDuration: 3500})
    }
  }

  private getLastRunData() {
    this.gableBackendService.getJsonSchemaCache().subscribe((res) => {
      if (res.result) {
        this.express = JSON.stringify(res.data.schema, null, '\t');
        this.code = JSON.stringify(res.data.json, null, '\t');
      }
      this.isHandlingData = false;
    });
  }
}
