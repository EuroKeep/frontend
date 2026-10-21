import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetListComponent } from './budget-list.component';

describe('TransactionMobileEditComponent', () => {
    let component: BudgetListComponent;
    let fixture: ComponentFixture<BudgetListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BudgetListComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
