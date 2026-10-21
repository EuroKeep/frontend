import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountListComponent } from './account-list.component';

describe('TransactionMobileEditComponent', () => {
    let component: AccountListComponent;
    let fixture: ComponentFixture<AccountListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountListComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
