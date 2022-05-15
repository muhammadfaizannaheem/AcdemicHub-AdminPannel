import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitiesRecordComponent } from './universities-record.component';

describe('UniversitiesRecordComponent', () => {
  let component: UniversitiesRecordComponent;
  let fixture: ComponentFixture<UniversitiesRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversitiesRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversitiesRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
