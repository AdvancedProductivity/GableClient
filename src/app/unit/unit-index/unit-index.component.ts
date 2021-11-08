import {AfterViewChecked, AfterViewInit, Component, OnInit, Output} from '@angular/core';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {ActivatedRoute} from '@angular/router';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {Result, UpdateOrPushInfo} from '../../core/Result';
import {GroupInfo, UnitMenuGroup, UnitResponse} from '../../core/UnitMenu';
import {TabInfo} from '../../core/TabInfo';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-unit-index',
  templateUrl: './unit-index.component.html',
  styles: [
    `
      .menuL {
        height: 100%;
        overflow-y: auto;
      }
    `
  ]
})
export class UnitIndexComponent implements OnInit {
  title = 'GableWeb';
  urls: TabInfo[] = [];
  height = 0;
  index = 0;
  isShowAddDialog = false;
  publicMenu: UnitMenuGroup[];
  userMenu: UnitMenuGroup[];
  groups: GroupInfo[] = [];
  publicGroups: GroupInfo[] = [];
  isShowPush = false;
  selectGroupUuid = '';
  pushedName = '';
  pushInfo = undefined;
  // 0 is push to public 1 is clone to user
  dialogType = 0;
  cloneUuid = '';
  constructor(private nzContextMenuService: NzContextMenuService,
              private gableBackendService: GableBackendService,
              private messageService: NzMessageService,
              private modal: NzModalService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight;
    const tabsInfoStr = localStorage.getItem('openTabs');
    if (tabsInfoStr !== null && tabsInfoStr !== undefined) {
      this.urls = JSON.parse(tabsInfoStr);
    }
    const enterId = this.route.snapshot.queryParams.tab;
    if (enterId !== undefined && enterId !== null && this.urls !== undefined && this.urls !== null && this.urls.length > 0) {
      this.urls.forEach((value, index) => {
        if (value.uuid === enterId) {
          this.index = index;
        }
      });
    }
    this.getMenu();
  }

  delete(uuid: any) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this unit?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.doDeleteUnit(uuid),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  addUrl(_uuid: string, _name: string, _groupName: string, _groupUuid: string, _type: string): void {
    console.log('zzq see added test type', _type);
    let isFound = false;
    let index = 0;
    this.urls.forEach((value, i) => {
      if (value.uuid === _uuid) {
        index = i;
        isFound = true;
      }
    });
    if (isFound) {
      this.index = index;
      localStorage.setItem('selectTabIndex', this.urls[index].uuid);
      return;
    }
    this.urls.push({uuid: _uuid, name: _name, groupName: _groupName, groupUuid: _groupUuid, type: _type});
    this.index = this.urls.length - 1;
    localStorage.setItem('openTabs', JSON.stringify(this.urls));
    localStorage.setItem('selectTabIndex', this.urls[index].uuid);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  deleteTab(i: number): void {
    this.urls.splice(i, 1);
    if (this.urls.length > 0) {
      localStorage.setItem('openTabs', JSON.stringify(this.urls));
      if (this.index >= this.urls.length) {
        this.index = this.urls.length - 1;
        if (this.index === -1) {
          localStorage.removeItem('selectTabIndex');
        }else {
          localStorage.setItem('selectTabIndex', this.urls[this.index].uuid);
        }
      }
    }else {
      localStorage.removeItem('openTabs');
    }
  }

  deleteAllTab() {
    this.urls = [];
    this.index = -1;
    localStorage.removeItem('openTabs');
    localStorage.removeItem('selectTabIndex');
  }

  changeSelectTabs(no: any) {
    if (undefined !== this.urls[no]) {
      localStorage.setItem('selectTabIndex', this.urls[no].uuid);
    }
  }

  updateUserMenu(newMenu: UnitResponse) {
    if (newMenu.user !== undefined) {
      this.userMenu = newMenu.user;
      this.groups = [];
      this.userMenu.forEach(value => {
        this.groups.push({name: value.groupName, id: value.uuid});
      });
    }
    if (newMenu.public !== undefined) {
      this.publicMenu = newMenu.public;
      this.publicGroups = [];
      this.publicMenu.forEach(value => {
        this.publicGroups.push({name: value.groupName, id: value.uuid});
      });
    }
    this.isShowAddDialog = false;
  }

  doUpdateOrPush(info: UpdateOrPushInfo) {
    this.pushInfo = info;
    if (info.type === 'UPDATE') {
      this.gableBackendService.updateUnit({
        from: this.pushInfo.from,
        to: this.pushInfo.to
      }).subscribe(res => {
        this.isShowPush = false;
        this.messageService.success('Update success');
      });
      return;
    }
    this.selectGroupUuid = '';
    this.pushedName = '';
    this.isShowPush = true;
    this.dialogType = 0;
  }

  clone(uuid: string, originName: string) {
    this.selectGroupUuid = '';
    this.pushedName = originName;
    this.isShowPush = true;
    this.dialogType = 1;
    this.cloneUuid = uuid;
  }

  pushOrUpdate(){
    if (this.selectGroupUuid === '') {
      this.messageService.error('Please select group');
      return;
    }
    if (this.pushedName === '') {
      this.messageService.error('Please enter pushed name');
      return;
    }
    if (this.dialogType === 0) {
      this.gableBackendService.pushUnit({
        from: this.pushInfo.from,
        toGroup: this.selectGroupUuid,
        testName: this.pushedName
      }).subscribe(res => {
        // this.isShowPush = false;
        // if (res.result) {
        //   this.getMenu();
        //   this.messageService.success('Push Success');
        // }else {
        //   this.messageService.error('Push Failed');
        // }
        location.reload();
      });
    }else {
      this.gableBackendService.clone({
        uuid: this.cloneUuid,
        toGroup: this.selectGroupUuid,
        testName: this.pushedName
      }).subscribe(res => {
        this.isShowPush = false;
        if (res.result) {
          this.getMenu();
          this.messageService.success('Clone Success');
        }else {
          this.messageService.error('Clone Failed');
        }
      });
    }
  }

  private getMenu() {
    this.gableBackendService.getUnitMenu().subscribe((menu: Result<UnitResponse>) => {
      this.publicMenu = menu.data.public;
      this.userMenu = menu.data.user;
      this.groups = [];
      this.userMenu.forEach(value => {
        this.groups.push({name: value.groupName, id: value.uuid});
      });
      this.publicGroups = [];
      this.publicMenu.forEach(value => {
        this.publicGroups.push({name: value.groupName, id: value.uuid});
      });
    });
  }

  private doDeleteUnit(uuid: string) {
    let i = -1;
    this.urls.forEach((value, index) => {
      if (value.uuid === uuid) {
        i = index;
      }
    });
    this.gableBackendService.deleteUnitTest(uuid).subscribe((res) => {
      if (res.result) {
        this.userMenu = res.data.user;
      }
      if (i !== -1) {
        this.deleteTab(i);
      }
    });
  }
}
