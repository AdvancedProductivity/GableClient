import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {TranslateService} from '@ngx-translate/core';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-global-setting',
  templateUrl: './global-setting.component.html',
  styles: [
  ]
})
export class GlobalSettingComponent implements OnInit {
  globalConfig = '{}';
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };

  constructor(private service: GableBackendService
    , private transService: TranslateService
    , private messageService: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.service.getGlobalConfig().subscribe((res: any) => {
      this.globalConfig = JSON.stringify(res, null, '\t');
    });
  }

  save() {
    try {
      const config = JSON.parse(this.globalConfig);
      this.service.updateGlobalConfig(config).subscribe((response: any) => {
        if (response.result) {
          this.transService.get('MODIFY_SUCCESS').subscribe((str) => {
            this.messageService.success(str);
          });
        }else {
          this.transService.get('MODIFY_ERROR').subscribe((str) => {
            this.messageService.success(str + ' ' + response.message, {nzDuration: 3500});
          });
        }
      }, error => {
        this.transService.get('MODIFY_ERROR').subscribe((str) => {
          this.messageService.error(str);
        });
      });
    } catch (e){
      this.transService.get('INVALID_JSON_STR').subscribe(res => {
        this.messageService.info(res + ' ' + e);
      });
    }
  }
}
