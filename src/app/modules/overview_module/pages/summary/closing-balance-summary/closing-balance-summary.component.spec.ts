import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingBalanceSummaryComponent } from './closing-balance-summary.component';

describe('TransactionMobileEditComponent', () => {
    let component: ClosingBalanceSummaryComponent;
    let fixture: ComponentFixture<ClosingBalanceSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClosingBalanceSummaryComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
