import { TestBed } from '@angular/core/testing';
import { MessageService } from '@openng/optimus-ui/api';

import { NotyService } from './noty.service';

describe('NotyService', () => {
    let service: NotyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessageService]
        });
        service = TestBed.inject(NotyService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
