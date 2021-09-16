import {Component, ViewContainerRef} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {NzModalService} from 'ng-zorro-antd/modal';
import {SettingModalIndexComponent} from './setting/setting-modal-index/setting-modal-index.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
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

  async openSetting() {
    console.log('open config page dialog');
    const settingTip: string = await this.getTrans('PAGES.SETTING.TITLE');
    // todo click setting should open setting dialog
    const modal = this.modal.create({
      nzTitle: settingTip,
      nzMaskClosable: false,
      nzWidth: 800,
      nzBodyStyle: {paddingTop: '0', paddingBottom: '0'},
      nzContent: SettingModalIndexComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise(resolve => setTimeout(resolve, 1000)),
      nzFooter: []
    });
  }

  private async getTrans(key: string) {
    let str = '';
    await this.translate.get(key).subscribe((res: string) => {
      str = res;
    });
    return str;
  }
}
