import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateBrowserComponent } from './date-browser.component';

describe('AbstractComponent', () => {
  let component: DateBrowserComponent;
  let fixture: ComponentFixture<DateBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
