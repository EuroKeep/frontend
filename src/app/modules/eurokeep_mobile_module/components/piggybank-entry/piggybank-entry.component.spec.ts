import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiggybankEntryComponent } from './piggybank-entry.component';

describe('AbstractComponent', () => {
  let component: PiggybankEntryComponent;
  let fixture: ComponentFixture<PiggybankEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiggybankEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiggybankEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
