import { Component, OnInit } from '@angular/core';
import {ElectronService} from '../../core/services';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-setting-modal-index',
  templateUrl: './setting-modal-index.component.html',
  styleUrls: ['./setting-modal-index.component.scss']
})
export class SettingModalIndexComponent implements OnInit {

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
  }

}
