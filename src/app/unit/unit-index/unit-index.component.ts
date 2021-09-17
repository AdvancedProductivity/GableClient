import {AfterViewChecked, AfterViewInit, Component, OnInit, Output} from '@angular/core';
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {ActivatedRoute} from '@angular/router';
interface A{
  lable: string;
  param: string;
}
@Component({
  selector: 'app-unit-index',
  templateUrl: './unit-index.component.html',
  styles: [
  ]
})
export class UnitIndexComponent implements OnInit {
  title = 'GableWeb';
  urls: A[] = [
  ];
  index = 0;
  constructor(private nzContextMenuService: NzContextMenuService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const tabsInfoStr = localStorage.getItem('openTabs');
    if (tabsInfoStr !== null && tabsInfoStr !== undefined) {
      this.urls = JSON.parse(tabsInfoStr);
    }
    const enterId = this.route.snapshot.queryParams.tab;
    // todo there should get menu tree first.make sure menu have enter id
    if (enterId !== undefined && enterId !== null && this.urls !== undefined && this.urls !== null && this.urls.length > 0) {
      this.urls.forEach((value, index) => {
        if (value.lable === enterId) {
          this.index = index;
        }
      });
    }
  }

  addUrl(l: string, p: string): void {
    let isFound = false;
    let index = 0;
    this.urls.forEach((value,i) => {
      if (value.lable === l) {
        index = i;
        isFound = true;
      }
    });
    if (isFound) {
      this.index = index;
      localStorage.setItem('selectTabIndex', this.urls[index].lable);
      return;
    }
    this.urls.push({lable: l, param: p});
    this.index = this.urls.length - 1;
    localStorage.setItem('openTabs', JSON.stringify(this.urls));
    localStorage.setItem('selectTabIndex', this.urls[index].lable);
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
          localStorage.setItem('selectTabIndex', this.urls[this.index].lable);
        }
      }
    }else {
      localStorage.removeItem('openTabs');
    }
  }

  changeSelectTabs(no: any) {
    localStorage.setItem('selectTabIndex', this.urls[no].lable);
  }
}
