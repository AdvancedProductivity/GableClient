import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SettingModalIndexComponent} from './setting/setting-modal-index/setting-modal-index.component';
import {NzDrawerService} from 'ng-zorro-antd/drawer';
import {PlayGroundDrawerIndexComponent} from './play-ground/play-ground-drawer-index/play-ground-drawer-index.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isOnUnit = true;
  constructor(
    private modal: NzModalService,
    private drawerService: NzDrawerService,
    private viewContainerRef: ViewContainerRef,
    private electronService: ElectronService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) {
    let lang = localStorage.getItem('lang');
    if (lang === null || lang === undefined || lang.length === 0) {
      lang = 'en_US';
      localStorage.setItem('lang', lang);
    }else {
      // judge the stored i18n key is support
      if (lang !== 'en_US' && lang !== 'zh_CN') {
        lang = 'en_US';
        localStorage.setItem('lang', lang);
      }
    }
    this.translate.setDefaultLang(lang);
    this.translate.addLangs(['en_US', 'zh_CN']);
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
  }

  async openSetting() {
    const settingTip: string = await this.getTrans('PAGES.SETTING.TITLE');
    this.modal.create({
      nzTitle: settingTip,
      nzMaskClosable: false,
      nzWidth: '80%',
      nzBodyStyle: {paddingTop: '0', paddingBottom: '0'},
      nzContent: SettingModalIndexComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: []
    });
  }

  async openPlayGround() {
    const playGroundTip: string = await this.getTrans('PAGES.PLAY_GROUND.TITLE');
    this.drawerService.create<PlayGroundDrawerIndexComponent, { value: string }, string>({
      nzTitle: playGroundTip,
      nzWidth: '90%',
      nzContent: PlayGroundDrawerIndexComponent
    });
  }

  gotoUnit() {
    const v = localStorage.getItem('selectTabIndex');
    if (v !== undefined && v != null) {
      this.router.navigate(['unit'], {queryParams: {tab: v}});
    }else {
      this.router.navigate(['unit']);
    }
    this.isOnUnit = true;
  }

  private async getTrans(key: string) {
    let str = '';
    await this.translate.get(key).subscribe((res: string) => {
      str = res;
    });
    return str;
  }
}
