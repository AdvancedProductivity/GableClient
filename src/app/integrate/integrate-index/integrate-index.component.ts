import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-integrate-index',
  templateUrl: './integrate-index.component.html',
  styles: [
  ]
})
export class IntegrateIndexComponent implements OnInit {
  result: Object = 100;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  calculation() {
    this.http.post('/api/test/add?a=10&b=12', null).subscribe((res) => {
      console.log(res);
      this.result = res;
    });
  }


}
