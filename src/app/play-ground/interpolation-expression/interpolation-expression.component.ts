import { Component, OnInit } from '@angular/core';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-interpolation-expression',
  templateUrl: './interpolation-expression.component.html',
  styles: [
  ]
})
export class InterpolationExpressionComponent implements OnInit {
  height = 450;
  tip = '';
  express = `
{
  "express":{
    "拼接字符串": "{{static(prefix_) + random(letter, 10)}}",
    "当前时间戳": "{{dateTime(timestamp)}}",
    "当前日期": "{{dateTime(yyyy-MM-dd HH:mm:ss)}}",
    "今日0点": "{{dateTime(yyyy-MM-dd) + static( 00:00:00)}}",
    "今日23:59:59": "{{dateTime(yyyy-MM-dd) + static( 23:59:59)}}",
    "长度10位随机字符(指定范围)": "{{random(string,10,abcdefgtg十大按时打卡是大多数)}}",
    "长度10位英文字母": "{{random(letter, 10)}}",
    "长度10位随机数字": "{{random(numberStr, 10)}}",
    "长度10位字母和数字": "{{random(letterAndNumber, 10)}}",
    "5到100之间的随机整数": "{{random(int,5,100)}}",
    "5到100之间的随机小数": "{{random(double,5,100)}}",
    "instance中的字段变量":"{{instance(/dataSetA/aField)}}",
    "instance中的数组变量":"{{instance(/arrayB/1)}}",
    "global中的字段变量":"{{global(/dataSet/a)}}",
    "global中的数组变量":"{{global(/v)}}"
  },
  "instance":{
    "dataSetA": {
      "aField": "aStr",
      "bField": 10
    },
    "arrayB": [
      "First String",
      10,
      7
    ]
  },
  "global": {
    "dataSet":{
      "a": "stringFromGlobal"
    },
    "v": "vStr"
  }
}
`;
  code = '';
  leftEditor: MonacoStandaloneCodeEditor | undefined;
  rightEditor: MonacoStandaloneCodeEditor | undefined;
  config = {
    theme: 'vs-light', language: 'json', fontSize: 14, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  isHandlingData = false;
  constructor(private gableBackendService: GableBackendService,
              private messageService: NzMessageService) { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 55 - 24 - 46 - 16 - 32 - 48 -43;
    this.setLastRunRecord();
  }

  preHandle() {
    this.isHandlingData = true;
    try {
      const data = JSON.parse(this.express);
      this.gableBackendService.preHandle(data).subscribe((res) => {
        this.code = JSON.stringify(res, null, '\t');
        localStorage.setItem('interpolationExpression', this.express);
        this.isHandlingData = false;
      },error => {
        this.code = JSON.stringify(error, null, '\t');
        this.isHandlingData = false;
      });
    } catch (e){
      this.isHandlingData = false;
      this.code = JSON.stringify(e, null, '\t');
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

  private setLastRunRecord() {
    const item = localStorage.getItem('interpolationExpression');
    if (item !== null && item !== undefined && item.length > 0) {
      this.express = item;
    }
  }
}
