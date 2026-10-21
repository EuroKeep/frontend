import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingMobileEditComponent } from './saving-mobile-edit.component';

describe('SavingMobileEditComponent', () => {
    let component: SavingMobileEditComponent;
    let fixture: ComponentFixture<SavingMobileEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SavingMobileEditComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
