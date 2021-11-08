import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgTerminal} from 'ng-terminal';
import {Terminal} from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FunctionsUsingCSI } from 'ng-terminal';

@Component({
  selector: 'app-cli-index',
  templateUrl: './cli-index.component.html',
  styles: [
  ]
})
export class CliIndexComponent implements OnInit,AfterViewInit {
  @ViewChild('term', {static: true}) child: NgTerminal;
  underlying: Terminal;
  nextLine = FunctionsUsingCSI.cursorColumn(1);
  tips =
      '$ \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ The Cli function is under development and will have the following features: \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$   1.Execute HTTP request through curl command \n' + this.nextLine
    + '$   2.Execute unit test or integration test through cli command \n' + this.nextLine
    + '$   3.Query test run log \n' + this.nextLine
    + '$   4.Manage configuration in the system \n' + this.nextLine
    + '$   5.Perform a performance test for a single HTTP request \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ All design is for efficiency,It is expected to go online on February 2022 \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ \n' + this.nextLine
    +'$ Cli功能正在开发中，它将会有以下特性 \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$   1.通过curl执行Http请求 \n' + this.nextLine
    + '$   2.通过cli命令执行单元测试或集成测试 \n' + this.nextLine
    + '$   3.查询各种测试的运行日志 \n' + this.nextLine
    + '$   4.管理系统的配置 \n' + this.nextLine
    + '$   5.执行针对单个Http请求的性能测试 \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ 一切设计都是为了效率,该功能预计在2022年2月份上线 \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ \n' + this.nextLine
    + '$ ' ;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.underlying = this.child.underlying;
    this.underlying.setOption('fontSize', 20);
    this.underlying.loadAddon(new WebLinksAddon());
    this.child.write(this.tips);
    this.child.keyEventInput.subscribe(e => {
      console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.keyCode === 13) {
        this.child.write('\n' + FunctionsUsingCSI.cursorColumn(1) + '$ '); // \r\n
      } else if (ev.keyCode === 8) {
        // Do not delete the prompt
        if (this.child.underlying.buffer.active.cursorX > 2) {
          this.child.write('\b \b');
        }
      } else if (printable) {
        this.child.write(e.key);
      }
    })
  }


}
