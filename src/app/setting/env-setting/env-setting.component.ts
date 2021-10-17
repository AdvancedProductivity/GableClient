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

  addNew() {
    const newId = 'addNew_' + new Date().getTime();
    const newConfig = {
      uuid: newId,
      name: 'New Config',
      config: `
{
  "replace": {},
  "add": {},
  "remove": {}
}
      `
    };
    this.envs.push(newConfig);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  modify(index: number) {
    const uuid = this.envs[index].uuid;
    const name = this.envs[index].name;
    if (!uuid.startsWith('addNew_')) {
      this.isGettingData = true;
      this.gableBackendService.getEnvDetail(uuid).subscribe((res) => {
        this.configStr = JSON.stringify(res, null, '\t');
        this.isGettingData = false;
      });
    } else {
      this.configStr = this.envs[index].config;
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
