import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionImageComponent } from './subscription-image.component';

describe('AbstractComponent', () => {
  let component: SubscriptionImageComponent;
  let fixture: ComponentFixture<SubscriptionImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
