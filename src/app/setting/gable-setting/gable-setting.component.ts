import {Component, OnInit} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {TranslateService} from '@ngx-translate/core';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-gable-setting',
  templateUrl: './gable-setting.component.html',
  styles: []
})
export class GableSettingComponent implements OnInit {
  code = '{}';
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
    this.service.getGableConfig().subscribe((res: any) => {
      this.code = JSON.stringify(res, null, '\t');
    });
  }

  save() {
    try {
      const config = JSON.parse(this.code);
      this.service.updateGableConfig(config).subscribe((response: any) => {
        this.transService.get('MODIFY_SUCCESS').subscribe((str) => {
          this.messageService.success(str);
        });
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
