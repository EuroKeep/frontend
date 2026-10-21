import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionIndex } from './user-login.component';

describe('TransactionMobileEditComponent', () => {
    let component: SubscriptionIndex;
    let fixture: ComponentFixture<SubscriptionIndex>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubscriptionIndex]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
