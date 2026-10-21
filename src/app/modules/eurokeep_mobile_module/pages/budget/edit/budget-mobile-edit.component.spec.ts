import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetMobileEditComponent } from './budget-mobile-edit.component';

describe('TransactionMobileEditComponent', () => {
    let component: BudgetMobileEditComponent;
    let fixture: ComponentFixture<BudgetMobileEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BudgetMobileEditComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
