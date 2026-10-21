import {HttpClient} from "@angular/common/http";
import {inject} from "@angular/core";
import {LocalStorageService} from "@coreui/angular";
import {TranslocoService} from "@jsverse/transloco";

export class AbstractService {
    protected readonly TranslocoService: TranslocoService = inject(TranslocoService);
    protected readonly http: HttpClient = inject(HttpClient);
    //protected readonly ChangeDetectorRef : ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly LocalStorageService: LocalStorageService = inject(LocalStorageService);
}