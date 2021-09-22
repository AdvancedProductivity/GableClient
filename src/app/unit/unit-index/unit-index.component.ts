import {AfterViewChecked, AfterViewInit, Component, OnInit, Output} from '@angular/core';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {ActivatedRoute} from '@angular/router';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {Result} from '../../core/Result';
import {UnitMenuGroup, UnitResponse} from '../../core/UnitMenu';
import {TabInfo} from '../../core/TabInfo';
@Component({
  selector: 'app-unit-index',
  templateUrl: './unit-index.component.html',
  styles: [
  ]
})
export class UnitIndexComponent implements OnInit {
  title = 'GableWeb';
  urls: TabInfo[] = [];
  index = 0;
  isShowAddDialog = false;
  publicMenu: UnitMenuGroup;
  userMenu: UnitMenuGroup;
  constructor(private nzContextMenuService: NzContextMenuService,
              private gableBackendService: GableBackendService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const tabsInfoStr = localStorage.getItem('openTabs');
    if (tabsInfoStr !== null && tabsInfoStr !== undefined) {
      this.urls = JSON.parse(tabsInfoStr);
    }
    const enterId = this.route.snapshot.queryParams.tab;
    console.log('enter id', enterId);
    console.log('urls', this.urls);
    if (enterId !== undefined && enterId !== null && this.urls !== undefined && this.urls !== null && this.urls.length > 0) {
      this.urls.forEach((value, index) => {
        if (value.uuid === enterId) {
          console.log('find');
          this.index = index;
        }
      });
    }
    this.getMenu();
  }

  addUrl(_uuid: string, _name: string, _groupName: string, _groupUuid: string): void {
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
    this.urls.push({uuid: _uuid, name: _name, groupName: _groupName, groupUuid: _groupUuid});
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

  changeSelectTabs(no: any) {
    localStorage.setItem('selectTabIndex', this.urls[no].uuid);
  }

  addDialog() {

  }

  private getMenu() {
    this.gableBackendService.getUnitMenu().subscribe((menu: Result<UnitResponse>) => {
      this.publicMenu = menu.data.public;
      this.userMenu = menu.data.user;
      console.log('zzq see menu', this.publicMenu);
    });
  }
}
