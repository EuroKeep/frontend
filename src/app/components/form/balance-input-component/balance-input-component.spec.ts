import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceInputComponent } from './balance-input-component';

describe('AbstractComponent', () => {
  let component: BalanceInputComponent;
  let fixture: ComponentFixture<BalanceInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
