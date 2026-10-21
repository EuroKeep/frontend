import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TransactionStreamComponent, TransferStreamComponent} from './transaction-stream.component';

describe('TransactionStreamComponent', () => {
    let component: TransferStreamComponent;
    let fixture: ComponentFixture<TransferStreamComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TransferStreamComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
