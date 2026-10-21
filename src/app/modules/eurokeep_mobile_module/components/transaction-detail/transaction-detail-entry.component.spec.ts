import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailEntryComponent } from './transaction-detail-entry.component';

describe('AbstractComponent', () => {
  let component: TransactionDetailEntryComponent;
  let fixture: ComponentFixture<TransactionDetailEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetailEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionDetailEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
