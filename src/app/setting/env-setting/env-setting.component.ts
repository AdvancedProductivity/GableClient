import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {TranslateService} from "@ngx-translate/core";
import {NzMessageService} from "ng-zorro-antd/message";

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
              private messageService: NzMessageService,
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
  "remove": {},
  "removeByIndex": {}
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
      let have = false;
      this.envs.forEach(value => {
        if (value.name === this.name) {
          have = true;
        }
      });
      if (have) {
        this.messageService.error('Env Name: ' + this.name + ' Have Exist', {nzDuration: 3500});
        return;
      }
      this.gableBackendService.addEnv(this.configStr, this.name, this.type).subscribe(res => {
        if (res.result) {
          localStorage.setItem('env', JSON.stringify(res.data));
          this.gableBackendService.setEnv(res.data);
          this.modal.destroy({});
        } else {
          this.messageService.error('Save Env Error ' + res.message, {nzDuration: 3500});
        }
      });
    } else {
      this.gableBackendService.updateEnv(this.configStr, this.name, this.selectedId).subscribe(res => {
        if (res.result) {
          localStorage.setItem('env', JSON.stringify(res.data));
          this.gableBackendService.setEnv(res.data);
          this.modal.destroy({});
        } else {
          this.messageService.error('Save Env Error ' + res.message, {nzDuration: 3500});
        }
      });
    }
  }
  private getEnv() {
    this.gableBackendService.getEnv().subscribe(res => {
      this.envs = res;
    });
  }
}
