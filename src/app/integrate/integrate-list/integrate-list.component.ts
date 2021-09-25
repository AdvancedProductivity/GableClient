import { Component, OnInit } from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';

@Component({
  selector: 'app-integrate-list',
  templateUrl: './integrate-list.component.html',
  styles: [
  ]
})
export class IntegrateListComponent implements OnInit {
  list = [];

  constructor(private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
    this.gableBackendService.getIntegrate().subscribe((res) => {
      if (res.result) {
        this.list = res.data;
      }
    });
  }

}
