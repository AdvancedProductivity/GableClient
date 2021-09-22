import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GableBackendService} from '../../core/services/gable-backend.service';
import {FormBuilder, Validators} from '@angular/forms';
import {GroupInfo, UnitMenuGroup} from '../../core/UnitMenu';

@Component({
  selector: 'app-add-group-or-unit-test',
  templateUrl: './add-group-or-unit-test.component.html',
  styles: [
  ]
})
export class AddGroupOrUnitTestComponent implements OnInit {
  @Input() groups: GroupInfo[]= [];
  @Output() menuEvent = new EventEmitter<UnitMenuGroup[]>();
  groupForm = this.fb.group({
    groupName: ['', [Validators.required, Validators.minLength(1)]]
  });
  unitForm = this.fb.group({
    groupUuid: [null, [Validators.required]],
    type: [null, [Validators.required]],
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
      this.unitForm.value.unitName).subscribe(value => {
      this.menuEvent.emit(value.data.user);
    });
  }

  addGroup() {
    this.gableBackendService.addGroup(this.groupForm.value.groupName).subscribe(value => {
      this.menuEvent.emit(value.data.user);
    });
  }
}
