import {Component, OnDestroy, OnInit} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-integrate-list',
  templateUrl: './integrate-list.component.html',
  styles: [
  ]
})
export class IntegrateListComponent implements OnInit,OnDestroy {
  list = [];
  isAddTagModal = false;
  selectEnv = '';
  tagName = '';
  uuidWaitForAddUnit = '';
  isHandlingData = false;
  height = 500;
  isNeedLoop = false;
  loopGet = undefined;
  isShowHistory = false;
  historyData = [];
  isGettingHistory = false;
  constructor(private gableBackendService: GableBackendService,
              private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.getList();
    this.loopGet = setInterval(() => {
      if (this.isNeedLoop) {
        this.getList();
      }
    }, 3000);
    this.height = document.documentElement.clientHeight - 82;
  }

  ngOnDestroy(): void {
    if (this.loopGet !== undefined) {
      clearInterval(this.loopGet);
    }
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

  entrustRun(uuid: any, index: number) {
    this.gableBackendService.entrustRun(uuid, this.selectEnv).subscribe((res) => {
      if (res.result) {
        this.list[index].status = 1;
        this.message.success('start running');
        this.isNeedLoop = true;
      } else {
        this.message.error(res.message, {nzDuration: 3500});
      }
      this.isHandlingData = false;
    }, error => {
      this.isHandlingData = false;
      this.message.error('system error ' + error.message, {nzDuration: 3500});
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
        this.message.success('delete success');
      }else {
        this.message.error(res.message + ' can not delete');
      }
      this.isHandlingData = false;
    },error => {
      this.isHandlingData = false;
    });
  }

  refresh() {
    this.getList();
  }
  closeHistory(){
    this.isShowHistory = false;
    this.isGettingHistory = false;
  }

  showHistory(uuid: string) {
    this.isShowHistory = true;
    this.isGettingHistory = true;
    this.gableBackendService.getIntegrateRunHistory(uuid).subscribe((res) => {
      if (res.result) {
        this.isGettingHistory = false;
        this.historyData = res.data;
      }
    });
  }

  openReport(id, uuid: string) {
    window.open(this.gableBackendService.getServer() + 'api/report/preview?uuid=' + uuid +
      '&hisId=' + id + '&server=' + encodeURI(this.gableBackendService.getServer()), '_blank');
  }

  private getList() {
    this.gableBackendService.getIntegrate().subscribe((res) => {
      if (res.result) {
        this.list = res.data;
        let status = false;
        this.list.forEach(value => {
          if (value.status === 1) {
            status = true;
          }
        });
        this.isNeedLoop = status;
      }
    });
  }
}
