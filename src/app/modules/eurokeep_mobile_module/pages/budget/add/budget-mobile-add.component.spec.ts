import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetMobileAddComponent } from './budget-mobile-add.component';

describe('TransactionMobileEditComponent', () => {
    let component: BudgetMobileAddComponent;
    let fixture: ComponentFixture<BudgetMobileAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BudgetMobileAddComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
