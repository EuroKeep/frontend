import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingMobileAddComponent } from './saving-mobile-add.component';

describe('SavingMobileAddComponent', () => {
    let component: SavingMobileAddComponent;
    let fixture: ComponentFixture<SavingMobileAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SavingMobileAddComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
