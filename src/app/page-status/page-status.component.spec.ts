import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStatusComponent } from './page-status.component';

describe('PageStatusComponent', () => {
  let component: PageStatusComponent;
  let fixture: ComponentFixture<PageStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
