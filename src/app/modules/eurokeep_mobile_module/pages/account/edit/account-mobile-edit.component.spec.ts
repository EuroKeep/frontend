import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMobileEditComponent } from './account-mobile-edit.component';

describe('TransactionMobileEditComponent', () => {
    let component: AccountMobileEditComponent;
    let fixture: ComponentFixture<AccountMobileEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountMobileEditComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
