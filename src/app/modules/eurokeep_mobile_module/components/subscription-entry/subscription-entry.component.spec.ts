import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionEntryComponent } from './subscription-entry.component';

describe('AbstractComponent', () => {
  let component: SubscriptionEntryComponent;
  let fixture: ComponentFixture<SubscriptionEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
