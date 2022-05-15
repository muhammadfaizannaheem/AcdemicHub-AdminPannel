import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvRecordsComponent } from './cv-records.component';

describe('CvRecordsComponent', () => {
  let component: CvRecordsComponent;
  let fixture: ComponentFixture<CvRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
