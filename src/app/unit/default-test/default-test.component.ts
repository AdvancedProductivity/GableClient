import {Component, Input, OnInit} from '@angular/core';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';
import {GableBackendService} from '../../core/services/gable-backend.service';

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
  id = -1;
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
  constructor(private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
    if (this.uuid !== undefined) {
      this.getConfig();
    }
    console.log('zzq see config', this.uuid);
  }

  onContentResize({height}: NzResizeEvent) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentHeight = height;
    });
  }

  run() {
    this.isRunning = true;
    this.gableBackendService.runUnit(this.configJson, this.uuid, this.type).subscribe((res: any) => {
      if (this.type === 'HTTP' && res.result && res.data.code === 200) {
        this.responseJson = JSON.stringify(JSON.parse(res.data.content), null, '\t');
      } else {
        this.responseJson = JSON.stringify(res.data, null, '\t');
      }
      this.isRunning = false;
    }, error => {
      this.isRunning = false;
      this.responseJson = JSON.stringify(error, null, '\t');
    });
  }

  private getConfig() {
    this.gableBackendService.getUnitConfig(this.uuid).subscribe((res) => {
      this.type = res.data.type;
      this.configJson = JSON.stringify(res.data.config, null, '\t');
    });
  }
}
