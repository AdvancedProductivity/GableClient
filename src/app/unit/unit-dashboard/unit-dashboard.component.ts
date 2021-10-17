import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UpdateOrPushInfo} from '../../core/Result';

@Component({
  selector: 'app-unit-dashboard',
  templateUrl: './unit-dashboard.component.html',
  styles: [
  ]
})
export class UnitDashboardComponent implements OnInit {
  @Input() id = '';
  @Input() type = 'HTTP';
  height = 400;
  @Output() updateOrPush = new EventEmitter<UpdateOrPushInfo>();
  constructor() { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 40 - 16;
  }

  doUpdateOrPush(info: UpdateOrPushInfo) {
    this.updateOrPush.emit(info);
  }
}
