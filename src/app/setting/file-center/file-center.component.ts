import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ElectronService} from '../../core/services';

@Component({
  selector: 'app-file-center',
  templateUrl: './file-center.component.html',
  styles: [
  ]
})
export class FileCenterComponent implements OnInit {
  tag = '';
  name = '';
  fileList = [];
  constructor(private gableBackendService: GableBackendService,
              private electron: ElectronService,
              private msg: NzMessageService) { }

  ngOnInit(): void {
    this.getData();
  }

  getUploadPath(){
    return this.gableBackendService.getServer() +
      'api/fileCenter?tag=' + this.tag + '&name=' + this.name;
  }

  handleChange(info: any) {
    if (info.file.status === 'done') {
      console.log('file', info);
      this.msg.success(`${info.file.name} file uploaded successfully`);
      this.getData();
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  confirmDelete(index: number, uuid: string) {
    this.gableBackendService.removeFile(uuid).subscribe((res) => {
      if (res.result) {
        this.msg.success('delete success');
        this.getData();
      }
    });
  }

  download(i, uuid: any) {
    if (this.electron.isElectron) {
      this.msg.error('Can not download in Client', {nzDuration: 3500});
      return;
    }
    window.open(this.gableBackendService.getServer() + 'api/fileCenter/file?uuid=' + uuid, '_blank');
  }

  private getData() {
    this.gableBackendService.getFileList().subscribe((res) => {
      if (res.result && res.data !== undefined) {
        this.fileList = res.data;
      }else {
        this.fileList = [];
      }
    });
  }
}
