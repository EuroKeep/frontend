import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMobileAddComponent } from './transaction-mobile-add.component';

describe('TransactionMobileEditComponent', () => {
    let component: TransactionMobileAddComponent;
    let fixture: ComponentFixture<TransactionMobileAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TransactionMobileAddComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
