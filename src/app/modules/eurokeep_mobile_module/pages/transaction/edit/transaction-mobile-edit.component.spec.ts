import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMobileEditComponent } from './transaction-mobile-edit.component';

describe('TransactionMobileEditComponent', () => {
    let component: TransactionMobileEditComponent;
    let fixture: ComponentFixture<TransactionMobileEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TransactionMobileEditComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
