import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationFeedbackComponent } from './validation-feedback.component';

describe('AbstractComponent', () => {
  let component: ValidationFeedbackComponent;
  let fixture: ComponentFixture<ValidationFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
