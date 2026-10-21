import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMobileAddComponent } from './account-mobile-add.component';

describe('TransactionMobileEditComponent', () => {
    let component: AccountMobileAddComponent;
    let fixture: ComponentFixture<AccountMobileAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountMobileAddComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
