import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionStreamComponent } from './transaction-list.component';

describe('AbstractComponent', () => {
  let component: TransactionStreamComponent;
  let fixture: ComponentFixture<TransactionStreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionStreamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
