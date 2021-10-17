import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {FormBuilder, Validators} from '@angular/forms';
import {GroupInfo, UnitResponse} from '../../core/UnitMenu';
import {Result} from "../../core/Result";

@Component({
  selector: 'app-add-group-or-unit-test',
  templateUrl: './add-group-or-unit-test.component.html',
  styles: [
  ]
})
export class AddGroupOrUnitTestComponent implements OnInit {
  @Input() groups: GroupInfo[]= [];
  @Output() menuEvent = new EventEmitter<UnitResponse>();
  groupForm = this.fb.group({
    type: ['user', [Validators.required]],
    groupName: ['', [Validators.required, Validators.minLength(1)]]
  });
  unitForm = this.fb.group({
    groupUuid: [null, [Validators.required]],
    type: ['HTTP', [Validators.required]],
    unitName: [null, [Validators.required, Validators.minLength(1)]]
  });

  constructor(private fb: FormBuilder,
              private gableBackendService: GableBackendService) {
  }

  ngOnInit(): void {
  }

  addUnit() {
    this.gableBackendService.addTest(this.unitForm.value.groupUuid,
      this.unitForm.value.type,
      this.unitForm.value.unitName).subscribe((value: Result<UnitResponse>) => {
      this.menuEvent.emit(value.data);
    });
  }

  addGroup() {
    this.gableBackendService.addGroup(this.groupForm.value.groupName, this.groupForm.value.type)
      .subscribe((value: Result<UnitResponse>) => {
        this.menuEvent.emit(value.data);
      });
  }
}
