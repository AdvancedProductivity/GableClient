import {Component, OnInit} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzResizeEvent} from 'ng-zorro-antd/resizable';

@Component({
  selector: 'app-integrate-run',
  templateUrl: './integrate-run.component.html',
  styles: []
})
export class IntegrateRunComponent implements OnInit {
  record: any[] = [];
  height = 500;
  inConfig = {
    theme: 'vs-light', language: 'json', fontSize: 12, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  outConfig = {
    theme: 'vs-light', language: 'json', fontSize: 12, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  validConfig = {
    theme: 'vs-light', language: 'text', fontSize: 12, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  isHandlingData = false;
  inStr = '';
  outStr = '';
  runner: any;
  integrateUuid = '';
  isShowHistory = false;
  selectEnvUuid = '';
  envs = [];
  contentHeight = 350;
  id = -1;
  showingType = 'HTTP';
  validteResultMsg = '';
  originalCode = `{"a": 12}`;
  modifiedCode = `{"a": 156}`;
  testGroups = [];
  runningIndex = 0;
  runningTestIndex = -1;
  usingTestIndex = 0;
  isRunning = false;
  isLoop = false;
  lastOut = {};
  nextIn = {};
  instance = {};
  canNotGoToLoop = false;
  isPausing = false;
  isDelaying = false;
  delayTime = 0;

  constructor(private router: Router,
              private gableBackendService: GableBackendService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 82;
    const enterId = this.route.snapshot.queryParams.uuid;
    const hisId = this.route.snapshot.queryParams.historyId;
    this.isShowHistory = (hisId !== undefined);
    this.integrateUuid = enterId;
    this.setEnv('HTTP');
    if (this.isShowHistory) {
      this.gableBackendService.getIntegrateHistory(enterId, hisId).subscribe((res) => {
        if (res.result) {
          this.record = res.data.detail;
        }
      });
    } else {
      this.gableBackendService.getIntegrateDetail(enterId).subscribe((res) => {
        if (res.result) {
          this.record = res.data;
          this.record.forEach((value => {
            value.status = 0;
            if (value.type !== 'STEP') {
              this.testGroups.push(value);
            }
          }));
          console.log('uuids', this.testGroups);
        }
      });
    }
  }

  onContentResize({height}: NzResizeEvent) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentHeight = height;
    });
  }

  onBack() {
    this.router.navigate(['../integrate']);
  }

  showDetail(uuid: any, caseId: any, version, historyId: any, type: string, index: number) {
    this.showingType = type;
    this.originalCode = '';
    this.modifiedCode = '';
    if (type === 'STEP') {
      this.inStr = this.record[index].code;
      this.inConfig = {...this.inConfig, language: 'groovy'};
      if (historyId === undefined) {
        return;
      }
      this.gableBackendService.getGroovyHistory(uuid, true, historyId).subscribe((res) => {
        if (res.result) {
          this.originalCode = JSON.stringify(res.data.before, null, '\t');
          this.modifiedCode = JSON.stringify(res.data.after, null, '\t');
          if (!res.data.validate.passed) {
            this.validteResultMsg = res.data.validate.code;
          }else {
            this.validteResultMsg = '';
          }
          this.isHandlingData = false;
        }
      });
      return;
    }
    this.inConfig = {...this.inConfig, language: 'json'};
    this.handleDetailAsTest(uuid, caseId, version, historyId);
  }

  pause() {
    this.isPausing = !this.isPausing;
  }

  stop() {
    if (this.runner !== undefined) {
      clearInterval(this.runner);
    }
    this.isRunning = false;
    if (this.isPausing) {
      this.isPausing = false;
    }
  }

  run() {
    this.isRunning = true;
    this.lastOut = {};
    this.instance = {};
    this.record.forEach((item => {
      item.status = 0;
      item.historyId = undefined;
    }));
    this.runningTestIndex = 0;
    this.usingTestIndex = -1;
    this.runningIndex = 0;
    this.runner = setInterval(() => {
      if (this.canNotGoToLoop) {
        return;
      }
      if (this.runningIndex === this.record.length) {
        if (this.runner !== undefined) {
          clearInterval(this.runner);
        }
        this.gableBackendService.addIntegrateHistory(this.integrateUuid, this.record).subscribe((res) => {
        });
        this.isRunning = false;
        return;
      }
      if (this.isPausing) {
        return;
      }
      if (this.isDelaying) {
        return;
      }
      const nextIn = this.getNextIn();
      if (nextIn === undefined) {
        return;
      }
      const item = this.record[this.runningIndex];
      item.status = 1;
      if (item.type !== 'STEP') {
        this.canNotGoToLoop = true;
        this.gableBackendService.runUnit(nextIn, item.uuid, item.type, true, '', this.instance)
          .subscribe((out: any) => {
            this.lastOut = out.data;
            if (out.data.validate.passed) {
              item.status = 2;
              item.historyId = out.data.historyId;
            } else {
              item.status = 3;
              item.historyId = out.data.historyId;
            }
            this.canNotGoToLoop = false;
          }, error => {
            item.status = 3;
            this.canNotGoToLoop = false;
          });
      } else {
        this.canNotGoToLoop = true;
        this.gableBackendService.runStep(nextIn, this.lastOut, this.instance, item.uuid).subscribe((out: any) => {
          if (out.data.validate.passed) {
            item.status = 2;
            item.historyId = out.data.historyId;
          } else {
            item.status = 3;
            item.historyId = out.data.historyId;
          }
          const newInstance = out.data.after.instance;
          const newNextIn = out.data.after.nextIn;
          if (newInstance !== undefined) {
            this.instance = newInstance;
          }
          if (newNextIn !== undefined) {
            this.nextIn = JSON.stringify(newNextIn, null, '\t');
          }
          this.canNotGoToLoop = false;
        }, error => {
          item.status = 3;
          this.canNotGoToLoop = false;
        });
      }
      this.runningIndex++;
      if (item.type !== 'STEP') {
        this.runningTestIndex++;
      }
      this.runDelay();
    }, 500);
  }

  private runDelay() {
    if (this.delayTime !== undefined && this.delayTime > 0) {
      console.log('start delay');
      this.isDelaying = true;
      setTimeout(() => {
        console.log('stop delay');
        this.isDelaying = false;
      }, (this.delayTime * 1000));
    }
  }

  private getNextIn(): any {
    if (this.usingTestIndex === this.runningTestIndex) {
      return this.nextIn;
    }
    this.usingTestIndex++;
    if (this.usingTestIndex === this.testGroups.length) {
      return {};
    }
    const item = this.testGroups[this.usingTestIndex];
    this.canNotGoToLoop = true;
    this.gableBackendService.getUnitConfigOfCase(item.uuid, true, item.caseId, item.version, this.selectEnvUuid).subscribe((configRes) => {
      const request = JSON.stringify(configRes.data.config, null, '\t');
      this.canNotGoToLoop = false;
      this.nextIn = request;
      console.log('get next in from server ', this.usingTestIndex);
    });
    return undefined;
  }

  private handleDetailAsTest(uuid: any, caseId: any, version, historyId: any) {
    this.isHandlingData = true;
    if (historyId === undefined) {
      this.gableBackendService.getUnitConfigOfCase(uuid, true, caseId, version, this.selectEnvUuid).subscribe((res) => {
        if (res.result) {
          this.inStr = JSON.stringify(res.data, null, '\t');
          this.isHandlingData = false;
        }
      });
      return;
    }
    this.gableBackendService.getUnitHistory(uuid, true, historyId).subscribe((res) => {
      if (res.result) {
        this.inStr = JSON.stringify(res.data.in, null, '\t');
        this.outStr = JSON.stringify(res.data.out, null, '\t');
        this.isHandlingData = false;
      }
    });
  }

  private setEnv(envTypeName: string) {
    const defaultConfig = {name: 'Un Select', uuid: ''};
    const envArrays = this.gableBackendService.getEnvs();
    const arr = [];
    arr.push(defaultConfig);
    if (envArrays !== undefined) {
      envArrays.forEach((value) => {
        arr.push(value);
      });
    }
    this.envs = arr;
  }

}
