import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpamsaveButtonComponent } from './spamsave-button.component';

describe('AbstractComponent', () => {
  let component: SpamsaveButtonComponent;
  let fixture: ComponentFixture<SpamsaveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpamsaveButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpamsaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
