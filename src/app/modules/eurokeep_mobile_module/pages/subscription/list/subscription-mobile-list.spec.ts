import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionMobileListComponent } from './subscription-mobile-list.component';

describe('TransactionMobileEditComponent', () => {
    let component: SubscriptionMobileListComponent;
    let fixture: ComponentFixture<SubscriptionMobileListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubscriptionMobileListComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
