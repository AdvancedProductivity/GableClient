import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-unit-dashboard',
  templateUrl: './unit-dashboard.component.html',
  styles: [
  ]
})
export class UnitDashboardComponent implements OnInit {
  @Input() id = '';
  height = 400;
  constructor() { }

  ngOnInit(): void {
    this.height = document.documentElement.clientHeight - 40 - 16;
  }

}
