import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractInputComponent } from './abstract-input.component';

describe('AbstractComponent', () => {
  let component: AbstractInputComponent;
  let fixture: ComponentFixture<AbstractInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
