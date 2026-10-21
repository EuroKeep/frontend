import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEntryComponent } from './account-entry.component';

describe('AbstractComponent', () => {
  let component: AccountEntryComponent;
  let fixture: ComponentFixture<AccountEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
