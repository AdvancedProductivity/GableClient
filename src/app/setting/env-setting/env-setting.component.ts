import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-env-setting',
  templateUrl: './env-setting.component.html',
  styles: [
  ]
})
export class EnvSettingComponent implements OnInit {
  envs = [];
  name = '';
  configStr = '';
  type = '';
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: false
  };
  selectedId = '';
  isGettingData = false;
  constructor(private nzContextMenuService: NzContextMenuService,
              private gableBackendService: GableBackendService,
              private modal: NzModalRef) { }

  ngOnInit(): void {
    this.getEnv();
  }

  addNew(typeName) {
    console.log('add Type Name', typeName);
    this.envs.forEach(value => {
      if (value.typeName === typeName) {
        const newId = 'addNew_' + new Date().getTime();
        const newConfig = {
          uuid: newId,
          name: 'New Config',
          config: '{}'
        };
        this.selectedId = newId;
        this.name = newConfig.name;
        this.type = typeName;
        this.configStr = newConfig.config;
        value.configs.push(newConfig);
      }
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  modify(uuid: string, name: string) {
    this.isGettingData = true;
    if (!uuid.startsWith('addNew_')) {
      this.gableBackendService.getEnvDetail(uuid).subscribe((res) => {
        this.configStr = JSON.stringify(res, null, '\t');
        this.isGettingData = false;
      });
    }
    this.name = name;
    this.selectedId = uuid;
  }

  saveConfig() {
    if (this.selectedId.startsWith('addNew_')) {
      this.gableBackendService.addEnv(this.configStr, this.name, this.type).subscribe(res => {
        localStorage.setItem('env', JSON.stringify(res.data));
        this.gableBackendService.setEnv(res.data);
        this.modal.destroy({});
      });
    }else {
      this.gableBackendService.updateEnv(this.configStr, this.name, this.selectedId).subscribe(res => {
        localStorage.setItem('env', JSON.stringify(res.data));
        this.gableBackendService.setEnv(res.data);
        this.modal.destroy({});
      });
    }
  }
  private getEnv() {
    this.gableBackendService.getEnv().subscribe(res => {
      this.envs = res;
    });
  }
}
