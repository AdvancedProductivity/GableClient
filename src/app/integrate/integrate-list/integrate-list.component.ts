import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-integrate-list',
  templateUrl: './integrate-list.component.html',
  styles: [
  ]
})
export class IntegrateListComponent implements OnInit {
  list = [];
  isAddTagModal = false;
  tagName = '';
  uuidWaitForAddUnit = '';
  isHandlingData = false;
  height = 500;
  constructor(private gableBackendService: GableBackendService,
              private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.getList();
    this.height = document.documentElement.clientHeight - 82;
  }

  addTag(uuid: string) {
    this.isAddTagModal = true;
    this.tagName = '';
    this.uuidWaitForAddUnit = uuid;
  }

  doAddTag() {
    if (this.tagName.length < 1) {
      this.message.info('please enter tag name');
      return;
    }
    this.gableBackendService.addTag(this.uuidWaitForAddUnit, this.tagName).subscribe((res) => {
      this.isAddTagModal = false;
      this.uuidWaitForAddUnit = '';
      if (res.result) {
        this.getList();
      }
    });
  }

  confirmDelete(i) {
    if (this.list[i] === undefined) {
      this.message.info('not find ' + i);
      return;
    }
    this.isHandlingData = true;
    this.gableBackendService.deleteIntegrate(this.list[i].uuid).subscribe((res) => {
      if (res.result) {
        const tmpList = [];
        this.list.forEach(((value, index) => {
          if (i !== index) {
            tmpList.push(value);
          }
        }));
        this.list = tmpList;
      }
      this.isHandlingData = false;
    },error => {
      this.isHandlingData = false;
    });
  }

  refresh() {
    this.getList();
  }

  private getList() {
    this.gableBackendService.getIntegrate().subscribe((res) => {
      if (res.result) {
        this.list = res.data;
      }
    });
  }
}
