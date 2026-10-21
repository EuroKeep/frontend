import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreuiHeaderComponent } from './login.layout';

describe('CoreuiHeaderComponent', () => {
    let component: CoreuiHeaderComponent;
    let fixture: ComponentFixture<CoreuiHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoreuiHeaderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CoreuiHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
