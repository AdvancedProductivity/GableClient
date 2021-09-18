import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-language-setting',
  templateUrl: './language-setting.component.html',
  styles: [
  ]
})
export class LanguageSettingComponent implements OnInit {
  currentLanguage = 'en_US';
  originLanguage = 'en_US';
  langs: string[] = [];
  constructor(private translate: TranslateService,
              private modal: NzModalRef) { }

  ngOnInit(): void {
    this.langs = this.translate.getLangs();
    this.currentLanguage = this.translate.getDefaultLang();
    this.originLanguage = this.currentLanguage;
  }

  doModify() {
    if (this.originLanguage === this.currentLanguage) {
      return;
    }
    this.translate.setDefaultLang(this.currentLanguage);
    this.originLanguage = this.currentLanguage;
    localStorage.setItem('lang', this.currentLanguage);
    this.modal.destroy({});
  }
}
