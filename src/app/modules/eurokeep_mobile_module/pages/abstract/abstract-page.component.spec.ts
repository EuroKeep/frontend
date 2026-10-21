import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractPageComponent } from './abstract-page.component';

describe('TransactionMobileEditComponent', () => {
    let component: AbstractPageComponent;
    let fixture: ComponentFixture<AbstractPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AbstractPageComponent]
        })
            .compileComponents();

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
