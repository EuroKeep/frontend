import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzerTransactions } from './analyzer-transactions';

describe('TransactionMobileEditComponent', () => {
    let component: AnalyzerTransactions;
    let fixture: ComponentFixture<AnalyzerTransactions>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AnalyzerTransactions]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
