import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMobileEditComponent } from './subscription-mobile-edit.component';

describe('TransactionMobileEditComponent', () => {
    let component: SubscriptionMobileEditComponent;
    let fixture: ComponentFixture<SubscriptionMobileEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubscriptionMobileEditComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
