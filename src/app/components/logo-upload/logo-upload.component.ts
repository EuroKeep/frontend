import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    effect,
    input,
    Output,
    untracked,
    ViewChild
} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ButtonDirective} from "@coreui/angular";
import Dropzone, {DropzoneFile} from 'dropzone';
import {AbstractComponent} from "../abstract/abstract.component";
import {LogoItem, LogoService} from "../../services/logo/logo.interface";

/**
 * I am a Dropzone for exactly one logo of an item (e.g. a subscription or a payment method). The given
 * LogoService knows the URLs of the item type, see LogoBehavior in the backend.
 *
 * - Item with id (edit): a dropped/selected image is uploaded immediately and replaces the old logo.
 * - Item without id (add): the image is kept until uploadTo() is called with the id of the new item.
 * - The delete button discards a waiting image, or removes the saved logo of the item.
 */
@Component({
    selector: 'logo-upload',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        ButtonDirective,
    ],
    templateUrl: './logo-upload.component.html',
    styleUrl: './logo-upload.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoUploadComponent extends AbstractComponent {
    // Must match LogoBehavior::MIME_TYPES / MAX_BYTES in the backend.
    public static readonly ACCEPTED_FILES: string = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';
    public static readonly MAX_FILESIZE_MB: number = 2;

    /**
     * The element lives inside *transloco and is only rendered once the translations are loaded,
     * i.e. after ngAfterViewInit - so Dropzone is set up as soon as the element shows up.
     */
    @ViewChild('dropzone')
    protected set DropzoneElement(element: ElementRef<HTMLElement> | undefined) {
        if (element && !this.dropzone) {
            this.initDropzone(element.nativeElement);
        }
    }

    @Output()
    public LogoUploaded: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    public LogoDeleted: EventEmitter<any> = new EventEmitter<any>();

    // Emitted after every upload attempt, successful or not (e.g. to leave the add page afterwards).
    @Output()
    public LogoUploadFinished: EventEmitter<void> = new EventEmitter<void>();

    protected isDeleting: boolean = false;

    protected previewUrl: string | null = null;
    protected progress: number | null = null;
    protected errorMessage: string = '';

    private dropzone?: Dropzone;
    // Id of a just created item the queued file has to be uploaded to (add page only).
    private targetId?: number;

    readonly Item = input.required<LogoItem>();
    readonly LogoService = input.required<LogoService<any>>();

    constructor() {
        super();
        effect(() => {
            this.Item();
            untracked(() => this.updateAutoProcessQueue());
        });
    }

    private initDropzone(element: HTMLElement): void {
        this.dropzone = new Dropzone(element, {
            url: () => this.LogoService().uploadLogoUrl(this.targetId ?? this.Item().id),
            method: 'post',
            paramName: 'logo',
            acceptedFiles: LogoUploadComponent.ACCEPTED_FILES,
            maxFilesize: LogoUploadComponent.MAX_FILESIZE_MB,
            filesizeBase: 1024,
            uploadMultiple: false,
            parallelUploads: 1,
            disablePreviews: true,
            createImageThumbnails: false,
            autoProcessQueue: this.hasId(),
            dictInvalidFileType: this.TranslocoService.translate('Only images (PNG, JPEG, GIF, WebP, SVG) can be uploaded as logo.'),
            dictFileTooBig: this.TranslocoService.translate('The logo is too large (max. 2 MB).'),
        });

        // Only one logo: a newly added file replaces any file that is still waiting or uploading.
        this.dropzone.on('addedfile', (file: DropzoneFile) => {
            this.dropzone!.files
                .filter((other: DropzoneFile) => other !== file)
                .forEach((other: DropzoneFile) => this.dropzone!.removeFile(other));

            this.errorMessage = '';
            this.setPreview(file);
            this.ChangeDetectorRef.markForCheck();
        });

        this.dropzone.on('sending', (_file: DropzoneFile, xhr: XMLHttpRequest) => {
            xhr.setRequestHeader('X-CSRF-Token', this.AuthenticationService.csrfToken);
            this.progress = 0;
            this.ChangeDetectorRef.markForCheck();
        });

        this.dropzone.on('uploadprogress', (_file: DropzoneFile, progress: number) => {
            this.progress = Math.round(progress);
            this.ChangeDetectorRef.markForCheck();
        });

        this.dropzone.on('success', (file: DropzoneFile, response: any) => {
            if (response?.csrfToken) {
                this.AuthenticationService.csrfToken = response.csrfToken;
            }
            this.dropzone!.removeFile(file);
            this.setPreview(null);
            this.LogoUploaded.emit(response.item);
        });

        this.dropzone.on('error', (file: DropzoneFile, message: any) => {
            this.errorMessage = this.extractErrorMessage(message);
            this.dropzone!.removeFile(file);
            this.setPreview(null);
            this.NotyService.genericError(this.errorMessage, this.TranslocoService.translate('Logo'));
        });

        this.dropzone.on('complete', () => {
            this.progress = null;
            this.targetId = undefined;
            this.updateAutoProcessQueue();
            this.ChangeDetectorRef.markForCheck();
            this.LogoUploadFinished.emit();
        });
    }

    public override ngOnDestroy(): void {
        this.dropzone?.destroy();
        this.setPreview(null);
        super.ngOnDestroy();
    }

    /**
     * I tell whether a logo is waiting to be uploaded via uploadTo().
     */
    public hasPendingFile(): boolean {
        return (this.dropzone?.getQueuedFiles().length ?? 0) > 0;
    }

    /**
     * I will upload the waiting logo to the (just created) item with the given id.
     */
    public uploadTo(itemId: number): void {
        if (!this.hasPendingFile()) {
            return;
        }
        this.targetId = itemId;
        this.dropzone!.processQueue();
    }

    /**
     * I discard a waiting image (add page) or remove the saved logo of the item (edit page).
     */
    protected deleteLogo(): void {
        if (this.previewUrl) {
            this.dropzone?.removeAllFiles(true);
            this.setPreview(null);
            return;
        }

        if (!this.hasId() || !this.hasLogo()) {
            return;
        }
        if (!window.confirm(this.TranslocoService.translate('Do you really want to delete this logo?'))) {
            return;
        }

        this.isDeleting = true;
        this.Subscription.add(this.LogoService().deleteLogo(this.Item()).subscribe({
            next: (response) => {
                this.isDeleting = false;
                this.LogoDeleted.emit(response.item);
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => {
                this.isDeleting = false;
                this.NotyService.genericError(this.extractErrorMessage(error?.error), this.TranslocoService.translate('Logo'));
                this.ChangeDetectorRef.markForCheck();
            }
        }));
    }

    /**
     * I open the file picker (gallery / camera on mobile devices), e.g. via keyboard.
     */
    protected openFilePicker(event: Event): void {
        event.preventDefault();
        this.dropzone?.hiddenFileInput?.click();
    }

    protected hasLogo(): boolean {
        return this.LogoService().hasLogo(this.Item());
    }

    private hasId(): boolean {
        return !!this.Item().id;
    }

    private updateAutoProcessQueue(): void {
        if (this.dropzone) {
            this.dropzone.options.autoProcessQueue = this.hasId();
        }
    }

    private setPreview(file: File | null): void {
        if (this.previewUrl) {
            URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = file ? URL.createObjectURL(file) : null;
        this.ChangeDetectorRef.markForCheck();
    }

    private extractErrorMessage(message: any): string {
        if (typeof message === 'string') {
            return message;
        }
        const error = message?.error ?? message?.errors;
        if (Array.isArray(error) && error.length) {
            return this.TranslocoService.translate(String(error[0]));
        }
        return this.TranslocoService.translate('The logo upload failed.');
    }
}
