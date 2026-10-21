import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMobileAddComponent } from './subscription-mobile-add.component';

describe('TransactionMobileEditComponent', () => {
    let component: SubscriptionMobileAddComponent;
    let fixture: ComponentFixture<SubscriptionMobileAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubscriptionMobileAddComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
