import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingMobileSaveComponent } from './saving-mobile-save.component';

describe('TransactionMobileEditComponent', () => {
    let component: SavingMobileSaveComponent;
    let fixture: ComponentFixture<SavingMobileSaveComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SavingMobileSaveComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
