import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteSummaryComponent } from './complete-summary.component';

describe('TransactionMobileEditComponent', () => {
    let component: CompleteSummaryComponent;
    let fixture: ComponentFixture<CompleteSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CompleteSummaryComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
