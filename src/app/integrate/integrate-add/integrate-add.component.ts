import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-integrate-add',
  templateUrl: './integrate-add.component.html',
  styles: [`
    .unit_item {
      margin-bottom: 10px;
    }
  `
  ]
})
export class IntegrateAddComponent implements OnInit {
  height = 500;
  isShowCase = false;
  inStr = '';
  list = [];
  waitForSave = [];
  headers = [];
  currentVersion = 0;
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  isHandlingData = false;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly any[] = [];
  listOfCurrentPageData: readonly [] = [];
  setOfCheckedId = new Set<string>();
  selectCaseUuid = '';
  selectCaseName = '';
  selectTestType = '';
  isSave = false;
  name = '';
  constructor(private router: Router,
              private messageService: NzMessageService,
              private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 82;
    this.gableBackendService.getUnitMenu().subscribe((res) => {
      this.list = res.data.public;
    });
  }

  onBack() {
    this.router.navigate(['../integrate']);
  }

  addUnit(id: string, unitName: string, testType: string) {
    this.waitForSave.push({
      uuid: id,
      name: unitName,
      type: testType,
      tag: 'test'
    });
  }

  batchAdd(i) {
    this.list[i].units.forEach((data) => {
      this.addUnit(data.uuid, data.unitName, data.type);
    });
  }

  selectCase(uuid: string, name: string, testType: string) {
    this.gableBackendService.getCase(uuid, true).subscribe(res => {
      if (res.result) {
        this.selectCaseUuid = uuid;
        this.selectCaseName = name;
        this.selectTestType = testType;
        this.headers = res.data.headers;
        this.listOfData = res.data.record;
        this.currentVersion = res.data.version;
        this.isShowCase = true;
      }
    });

  }

  handleCancel() {
    this.headers = [];
    this.listOfData = [];
    this.currentVersion = 0;
    this.isShowCase = false;
  }
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly []): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest() {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    requestData.forEach((v)=>{
      this.waitForSave.push({
        uuid: this.selectCaseUuid,
        name: this.selectCaseName,
        type: this.selectTestType,
        tag: 'case',
        caseId: v.id,
        version: this.currentVersion
      });
    });
    this.headers = [];
    this.selectCaseUuid = '';
    this.listOfData = [];
    this.currentVersion = 0;
    this.isShowCase = false;
    this.setOfCheckedId.clear();
  }

  showItem(i) {
    const item = this.waitForSave[i];
    if (item === undefined) {
      return;
    }
    this.isHandlingData = true;
    this.gableBackendService.getUnitConfigOfCase(item.uuid, true, item.caseId, item.version).subscribe((res) => {
      if (res.result) {
        this.inStr = JSON.stringify(res.data, null, '\t');
        this.isHandlingData = false;
      }
    });
  }

  saveIntegrateTest() {
    if (this.waitForSave.length < 1) {
      this.messageService.error('Please select test');
      return;
    }
    this.isSave = true;
  }

  doSave() {
    if (this.name.length < 1) {
      this.messageService.error('Please set integrate test name');
      return;
    }
    this.gableBackendService.addIntegrate(this.waitForSave, this.name).subscribe((res) => {
      if (res.result) {
        this.onBack();
      }
    });
  }
}
