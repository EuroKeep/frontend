import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetProgressbarComponent } from './budget-progressbar.component';

describe('BudgetProgressbarComponent', () => {
  let component: BudgetProgressbarComponent;
  let fixture: ComponentFixture<BudgetProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetProgressbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
