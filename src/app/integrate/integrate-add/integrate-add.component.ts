import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzContextMenuService, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {MonacoEditorConstructionOptions, MonacoStandaloneCodeEditor} from '@materia-ui/ngx-monaco-editor';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  editingIndex = -1;
  headers = [];
  currentVersion = 0;
  config: MonacoEditorConstructionOptions = {
    theme: 'vs-light', language: 'json', fontSize: 12, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  isHandlingData = false;
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: readonly any[] = [];
  listOfCurrentPageData: readonly any[] = [];
  setOfCheckedId = new Set<string>();
  selectCaseUuid = '';
  selectCaseName = '';
  selectTestType = '';
  isShowStepNameDialog = false;
  name = '';
  codeEditor: MonacoStandaloneCodeEditor | undefined;
  // the type of dialog's ok btn clicked,0 is step.1 is save integrate.2 is add json schema
  saveType = 0;
  isAdded = true;
  uuid = '';
  isEditingList = false;
  constructor(private nzContextMenuService: NzContextMenuService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: NzMessageService,
              private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 82;
    const enterUuid = this.route.snapshot.queryParams.uuid;
    if (enterUuid !== undefined && enterUuid !== null) {
      this.isAdded = false;
      this.gableBackendService.getIntegrateDetail(enterUuid).subscribe((res) => {
        if (res.result) {
          this.waitForSave = res.data;
        }
      });
      this.uuid = enterUuid;
    }else {
      this.isAdded = true;
    }
    this.gableBackendService.getUnitMenu().subscribe((res) => {
      this.list = res.data.public;
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  onBack() {
    this.router.navigate(['../integrate']);
  }

  addUnit(id: string, unitName: string, testType: string) {
    this.waitForSave.push({
      uuid: id,
      name: unitName,
      type: testType,
      tag: 'test',
      ignore: false
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

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
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

  addCase() {
    const requestData = this.listOfData.filter(data => this.setOfCheckedId.has(data.id));
    requestData.forEach((v)=>{
      const item = {
        uuid: this.selectCaseUuid,
        name: v.id + '(' + this.selectCaseName + ')',
        type: this.selectTestType,
        tag: 'case',
        caseId: v.id,
        version: this.currentVersion
      };
      if (v.gable_title !== undefined) {
        item.name = v.gable_title + '(' + this.selectCaseName + ')';
      }
      this.waitForSave.push(item);
    });
    this.headers = [];
    this.selectCaseUuid = '';
    this.listOfData = [];
    this.currentVersion = 0;
    this.isShowCase = false;
    this.setOfCheckedId.clear();
  }
  addStep() {
    this.isShowStepNameDialog = true;
    this.saveType = 0;
    this.name = '';
  }

  addJsonSchemaStep() {
    this.isShowStepNameDialog = true;
    this.saveType = 2;
    this.name = '';
  }

  showItem(i) {
    const lastEdit = this.waitForSave[this.editingIndex];
    if (lastEdit !== undefined) {
      if (lastEdit.type === 'STEP' || lastEdit.type === 'JSON_SCHEMA') {
        lastEdit.code = this.inStr;
      }
    }
    this.editingIndex = i;
    const item = this.waitForSave[i];
    if (item === undefined) {
      return;
    }
    if (item.type === 'STEP') {
      this.showStepInfo(item);
      return;
    }
    if (item.type === 'JSON_SCHEMA') {
      this.showJsonSchemaInfo(item);
      return;
    }
    this.showTestInfo(item);
  }

  saveIntegrateTest() {
    if (this.waitForSave.length < 1) {
      this.messageService.error('Please select test');
      return;
    }
    if (this.isAdded) {
      this.addNewIntegrate();
      return;
    }
    this.updateIntegrateInfo();
  }

  doSave() {
    if (this.saveType === 0) {
      this.doAddStep();
      return;
    }
    if (this.saveType === 2) {
      this.doAddJsonSchema();
      return;
    }
    this.doSaveIntegrate();
  }

  delete(index: number) {
    if (this.editingIndex === index) {
      this.editingIndex = 0;
      this.inStr = '';
    }else if (this.editingIndex > index) {
      this.editingIndex -= 1;
    }
    this.waitForSave.splice(index, 1);
  }

  initEditor(editor: MonacoStandaloneCodeEditor): void {
    this.codeEditor = editor;
  }

  batchDelete() {
    if (this.waitForSave === undefined || this.waitForSave.length === 0) {
      return;
    }
    this.isEditingList = true;
    const newList = [];
    this.waitForSave.forEach(value => {
      if (!value.ignore) {
        newList.push(value);
      }
    });
    this.waitForSave = newList;
    this.isEditingList = false;
  }

  deleteAll() {
    this.isEditingList = true;
    this.waitForSave = [];
    setTimeout(() => {
      this.isEditingList = false;
    }, 500);
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.editingIndex === event.previousIndex) {
      this.editingIndex = event.currentIndex;
    }
    moveItemInArray(this.waitForSave, event.previousIndex, event.currentIndex);
  }

  private doAddStep() {
    this.waitForSave.push({
      uuid: undefined,
      name: this.name,
      type: 'STEP',
      code: '',
      tag: 'step'
    });
    this.isShowStepNameDialog = false;
  }

  private doAddJsonSchema() {
    this.waitForSave.push({
      uuid: undefined,
      name: this.name,
      type: 'JSON_SCHEMA',
      code: '',
      tag: 'JsonSchema'
    });
    this.isShowStepNameDialog = false;
  }

  private doSaveIntegrate() {
    if (this.name.length < 1) {
      this.messageService.error('Please set integrate test name');
      return;
    }
    const editing = this.waitForSave[this.editingIndex];
    if (editing !== undefined && (editing.type === 'STEP' || editing.type === 'JSON_SCHEMA')) {
      editing.code = this.inStr;
    }
    if (this.isAdded) {
      this.gableBackendService.addIntegrate(this.waitForSave, this.name).subscribe((res) => {
        if (res.result) {
          this.onBack();
        }
      });
    }
  }

  private addNewIntegrate() {
    this.isShowStepNameDialog = true;
    this.saveType = 1;
    this.name = '';
  }

  private updateIntegrateInfo() {
    const editing = this.waitForSave[this.editingIndex];
    if (editing !== undefined && (editing.type === 'STEP' || editing.type === 'JSON_SCHEMA')) {
      editing.code = this.inStr;
    }
    this.gableBackendService.updateIntegrate(this.waitForSave, this.uuid).subscribe((res) => {
      if (res.result) {
        this.onBack();
      }
    });
  }

  private showStepInfo(item: any) {
    this.inStr = item.code;
    this.config = {...this.config, language: 'groovy', readOnly: false};
  }

  private showJsonSchemaInfo(item: any) {
    this.inStr = item.code;
    this.config = {...this.config, language: 'json', readOnly: false};
  }

  private showTestInfo(item: any) {
    this.isHandlingData = true;
    this.gableBackendService.getUnitConfigOfCase(item.uuid, true, item.caseId, item.version).subscribe((res) => {
      if (res.result) {
        this.config = {...this.config, language: 'json', readOnly: true};
        this.inStr = JSON.stringify(res.data, null, '\t');
        this.isHandlingData = false;
      }
    });
  }
}
