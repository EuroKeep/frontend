import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiggybankProgressbarComponent } from './piggybank-progressbar.component';

describe('PiggybankProgressbarComponent', () => {
  let component: PiggybankProgressbarComponent;
  let fixture: ComponentFixture<PiggybankProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiggybankProgressbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PiggybankProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
