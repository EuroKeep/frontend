import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingMobileListComponent } from './saving-mobile-list.component';

describe('TransactionMobileEditComponent', () => {
    let component: SavingMobileListComponent;
    let fixture: ComponentFixture<SavingMobileListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SavingMobileListComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
