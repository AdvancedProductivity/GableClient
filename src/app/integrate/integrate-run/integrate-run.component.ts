import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-integrate-run',
  templateUrl: './integrate-run.component.html',
  styles: [
  ]
})
export class IntegrateRunComponent implements OnInit {
  record: any[] = [];
  height = 500;
  config = {
    theme: 'vs-light', language: 'json', fontSize: 12, glance: false, minimap: {enabled: false},
    lineDecorationsWidth: 1, readOnly: true
  };
  isHandlingData = false;
  isRunning = false;
  isLoop = false;
  inStr = '';
  outStr = '';
  runningIndex = 0;
  runner: any;
  integrateUuid = '';
  isShowHistory = false;
  selectEnvUuid = '';
  envs = [];
  constructor(private router: Router,
              private gableBackendService: GableBackendService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 82;
    const enterId = this.route.snapshot.queryParams.uuid;
    const hisId = this.route.snapshot.queryParams.historyId;
    this.isShowHistory = (hisId !== undefined);
    this.integrateUuid = enterId;
    this.setEnv('HTTP');
    if (this.isShowHistory) {
      this.gableBackendService.getIntegrateHistory(enterId,  hisId).subscribe((res) => {
        if (res.result) {
          this.record = res.data.detail;
        }
      });
    }else {
      this.gableBackendService.getIntegrateDetail(enterId).subscribe((res) => {
        if (res.result) {
          this.record = res.data;
          this.record.forEach((value => {
            value.status = 'wait';
          }));
          console.log(this.record);
        }
      });
    }
  }

  onBack() {
    this.router.navigate(['../integrate']);
  }

  showDetail(uuid: any, caseId: any, version, historyId: any) {
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
    return;
  }

  private setEnv(envTypeName: string) {
    const defaultConfig = {name: 'Un Select', uuid: ''};
    const envArrays = this.gableBackendService.getEnvByTypeFromCache(envTypeName);
    const arr = [];
    arr.push(defaultConfig);
    if (envArrays !== undefined) {
      envArrays.forEach((value) => {
        arr.push(value);
      });
    }
    this.envs = arr;
  }

  run() {
    this.isRunning = true;
    this.runningIndex = 0;
    this.record.forEach((item => {
      item.status = 'wait';
      item.historyId = undefined;
    }));
    this.runner = setInterval(() => {
      this.execute();
    }, 500);
  }

  private execute() {
    if (this.isLoop) {
      return;
    }
    if (this.runningIndex === this.record.length) {
      if (this.runner !== undefined) {
        clearInterval(this.runner);
        this.gableBackendService.addIntegrateHistory(this.integrateUuid, this.record).subscribe((res) => {
        });
        this.isRunning = false;
        this.isLoop = false;
      }
      return;
    }
    this.isLoop = true;
    const item = this.record[this.runningIndex];
    item.status = 'process';
    this.gableBackendService.getUnitConfigOfCase(item.uuid, true, item.caseId, item.version, this.selectEnvUuid).subscribe((configRes) => {
      const type = configRes.data.type;
      const request = JSON.stringify(configRes.data.config, null, '\t');
      this.gableBackendService.runUnit(request, item.uuid, type, true).subscribe((out: any) => {
        if (out.data.validate.passed) {
          item.status = 'finish';
          item.historyId = out.data.historyId;
        } else {
          item.status = 'error';
          item.historyId = out.data.historyId;
        }
        this.isLoop = false;
        this.runningIndex++;
      }, error => {
        item.status = 'error';
        this.isLoop = false;
        this.runningIndex++;
      });

    });
  }

}
