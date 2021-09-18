import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {GableBackendService} from '../../core/services/gable-backend.service';

@Component({
  selector: 'app-sample-groovy-running',
  templateUrl: './sample-groovy-running.component.html',
  styles: [
  ]
})
export class SampleGroovyRunningComponent implements OnInit {
  code = 'def a = 10\nassert a == 10';
  height = 450;
  config = {
    theme: 'vs-light', language: 'groovy', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  resultConfig = {
    theme: 'vs-light', language: 'text', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  resultContent = 'have not run code';

  constructor(private translate: TranslateService,
              private gableBackendService: GableBackendService,
              private service: GableBackendService) {
  }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 55 - 24 - 46 - 16 - 32 - 48;
    this.getDemoCode();
  }

  run() {
    if (this.code.length < 1) {
      return;
    }
    this.gableBackendService.runGroovySampleCode(this.code).subscribe((res: any) => {
      this.resultContent = res.message;
    });
  }

  private getDemoCode() {
    this.service.getSampleGroovyCode().subscribe((res: string) => {
      this.code = res;
    });
  }
}
