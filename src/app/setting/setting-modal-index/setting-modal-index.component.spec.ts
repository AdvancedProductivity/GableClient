import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingModalIndexComponent } from './setting-modal-index.component';

describe('SettingModalIndexComponent', () => {
  let component: SettingModalIndexComponent;
  let fixture: ComponentFixture<SettingModalIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingModalIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingModalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
