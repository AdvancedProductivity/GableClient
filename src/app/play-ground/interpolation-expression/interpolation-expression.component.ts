import { Component, OnInit } from '@angular/core';
import {MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-interpolation-expression',
  templateUrl: './interpolation-expression.component.html',
  styles: [
  ]
})
export class InterpolationExpressionComponent implements OnInit {
  height = 450;
  tip = '';
  express = '';
  defaultExpressCN = `
{
    "express": {
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
            "instance中的字段变量": "{{instance(/dataSetA/aField)}}",
            "instance中的数组变量": "{{instance(/arrayB/1)}}",
            "global中的字段变量": "{{global(/dataSet/a)}}",
            "global中的数组变量": "{{global(/v)}}",
            "日期计算": {
                "上周周一": "{{dateCal(weekReset,-1,2,yyyy-MM-dd HH:mm:ss)}}",
                "下周周一": "{{dateCal(weekReset,1,2,yyyy-MM-dd HH:mm:ss)}}",
                "上周周二": "{{dateCal(weekReset,-1,3,yyyy-MM-dd HH:mm:ss)}}",
                "过去第二周": "{{dateCal(weekReset,-2,3,yyyy-MM-dd HH:mm:ss)}}",
                "下下周周二": "{{dateCal(weekReset,2,3,yyyy-MM-dd HH:mm:ss)}}",
                "上周": "{{dateCal(weekCalculate,-1,yyyy-MM-dd HH:mm:ss)}}",
                "下下周": "{{dateCal(weekCalculate,2,yyyy-MM-dd HH:mm:ss)}}",
                "三天前": "{{dateCal(dayCalculate,-3,yyyy-MM-dd HH:mm:ss)}}",
                "三天后": "{{dateCal(dayCalculate,3,yyyy-MM-dd HH:mm:ss)}}",
                "一个月前": "{{dateCal(monthCalculate,-1,yyyy-MM-dd HH:mm:ss)}}",
                "一个月后": "{{dateCal(monthCalculate,1,yyyy-MM-dd HH:mm:ss)}}",
                "字符串拼接表示更详细的时间": {
                    "上周周一下午一点": "{{dateCal(weekReset,-1,2,yyyy-MM-dd) + static( 13:00:00)}}",
                    "下周周一早上八点": "{{dateCal(weekReset,1,2,yyyy-MM-dd) + static( 08:00:00)}}",
                    "一个月前凌晨零点": "{{dateCal(monthCalculate,-1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "一个月前23点59分59秒": "{{dateCal(monthCalculate,-1,yyyy-MM-dd) + static( 23:59:59)}}",
                    "今日凌晨零点": "{{dateCal(dayCalculate,0,yyyy-MM-dd) + static( 00:00:00)}}",
                    "今日23点59分59秒": "{{dateCal(dayCalculate,0,yyyy-MM-dd) + static( 23:59:59)}}",
                    "昨日凌晨零点": "{{dateCal(dayCalculate,-1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "昨日23点59分59秒": "{{dateCal(dayCalculate, -1 ,yyyy-MM-dd) + static( 23:59:59)}}",
                    "明日凌晨零点": "{{dateCal(dayCalculate,1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "明日23点59分59秒": "{{dateCal(dayCalculate,1,yyyy-MM-dd) + static( 23:59:59)}}"
                }
            }
    },
    "instance": {
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
        "dataSet": {
            "a": "stringFromGlobal"
        },
        "v": "vStr"
    }
}
`;
  defaultExpressEN = `
{
    "express": {
        "Splice String": "{{static(prefix_) + random(letter, 10)}}",
            "Current Timestamp": "{{dateTime(timestamp)}}",
            "Current Date": "{{dateTime(yyyy-MM-dd HH:mm:ss)}}",
            "0:00 Today": "{{dateTime(yyyy-MM-dd) + static( 00:00:00)}}",
            "23:59:59 Today": "{{dateTime(yyyy-MM-dd) + static( 23:59:59)}}",
            "Length 10 bit random characters (specified range)": "{{random(string,10,abcdefghisdasda)}}",
            "10 digit English letters in length": "{{random(letter, 10)}}",
            "Length: 10 random digits": "{{random(numberStr, 10)}}",
            "Length 10 letters and numbers": "{{random(letterAndNumber, 10)}}",
            "A random integer between 5 and 100": "{{random(int,5,100)}}",
            "Random decimals between 5 and 100": "{{random(double,5,100)}}",
            "Field variables in instance": "{{instance(/dataSetA/aField)}}",
            "Array variables in instance": "{{instance(/arrayB/1)}}",
            "Field variables in global": "{{global(/dataSet/a)}}",
            "Array variables in global": "{{global(/v)}}",
            "Date calculation": {
                "Last Monday": "{{dateCal(weekReset,-1,2,yyyy-MM-dd HH:mm:ss)}}",
                "Next Monday": "{{dateCal(weekReset,1,2,yyyy-MM-dd HH:mm:ss)}}",
                "Last Tuesday": "{{dateCal(weekReset,-1,3,yyyy-MM-dd HH:mm:ss)}}",
                "Last second week": "{{dateCal(weekReset,-2,3,yyyy-MM-dd HH:mm:ss)}}",
                "Next Tuesday": "{{dateCal(weekReset,2,3,yyyy-MM-dd HH:mm:ss)}}",
                "last week": "{{dateCal(weekCalculate,-1,yyyy-MM-dd HH:mm:ss)}}",
                "Next week": "{{dateCal(weekCalculate,2,yyyy-MM-dd HH:mm:ss)}}",
                "three days ago": "{{dateCal(dayCalculate,-3,yyyy-MM-dd HH:mm:ss)}}",
                "Three days later": "{{dateCal(dayCalculate,3,yyyy-MM-dd HH:mm:ss)}}",
                "A month ago": "{{dateCal(monthCalculate,-1,yyyy-MM-dd HH:mm:ss)}}",
                "A month later": "{{dateCal(monthCalculate,1,yyyy-MM-dd HH:mm:ss)}}",
                "String concatenation represents more detailed time": {
                    "1 p.m. last Monday": "{{dateCal(weekReset,-1,2,yyyy-MM-dd) + static( 13:00:00)}}",
                    "8:00 a.m. next Monday": "{{dateCal(weekReset,1,2,yyyy-MM-dd) + static( 08:00:00)}}",
                    "At 0:00 a.m. a month ago": "{{dateCal(monthCalculate,-1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "23:59:59 a month ago": "{{dateCal(monthCalculate,-1,yyyy-MM-dd) + static( 23:59:59)}}",
                    "At 0:00 this morning": "{{dateCal(dayCalculate,0,yyyy-MM-dd) + static( 00:00:00)}}",
                    "Today is 23:59:59": "{{dateCal(dayCalculate,0,yyyy-MM-dd) + static( 23:59:59)}}",
                    "At 0:00 yesterday morning": "{{dateCal(dayCalculate,-1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "Yesterday 23:59:59": "{{dateCal(dayCalculate, -1 ,yyyy-MM-dd) + static( 23:59:59)}}",
                    "At 0:00 tomorrow morning": "{{dateCal(dayCalculate,1,yyyy-MM-dd) + static( 00:00:00)}}",
                    "Tomorrow 23:59:59": "{{dateCal(dayCalculate,1,yyyy-MM-dd) + static( 23:59:59)}}"
                }
            }
    },
    "instance": {
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
        "dataSet": {
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
              private translate: TranslateService,
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

  reload() {
    let aValue = this.defaultExpressCN;
    if (this.translate.getDefaultLang() === 'en-US') {
      aValue = this.defaultExpressEN;
    }
    this.express = JSON.stringify(JSON.parse(aValue), null, '\t');
  }

  private setLastRunRecord() {
    const item = localStorage.getItem('interpolationExpression');
    if (item !== null && item !== undefined && item.length > 0) {
      this.express = item;
      return;
    }
    this.reload();
  }
}
