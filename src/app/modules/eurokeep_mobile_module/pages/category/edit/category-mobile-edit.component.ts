import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Category} from "../../../../../services/category/category.interface";
import {ApiEditResponse, ApiViewResponse} from "../../../../../services/abstract/abstract.interface";
import {CategoryMobileAddComponent} from "../add/category-mobile-add.component";
import {RouterLink} from "@angular/router";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";

@Component({
    selector: 'category-mobile-edit',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        CardFooterComponent,
        ButtonDirective,
        FormDirective,
        InputComponent,
        SpamsaveDirective,
        FaIconComponent,
        ColComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
        SelectComponent,
    ],
    templateUrl: './category-mobile-edit.component.html',
    styleUrl: './category-mobile-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryMobileEditComponent extends CategoryMobileAddComponent {
    override ngOnInit() {
        this.categoryId = Number(this.ActivatedRoute.snapshot.paramMap.get('categoryId'));

        this.Subscription.add(
            this.CategoryService.view(this.categoryId).subscribe({
                next: (result: ApiViewResponse<Category>) => {
                    this.post = result.item;
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error) => this.handleError(error?.error?.error)
            }));

        super.ngOnInit();
    }

    public delete(): void {
        // The TreeBehavior deletes all descendants along with the Category.
        if (!this.confirmDelete(this.TranslocoService.translate('Do you really want to delete this category including all of its subcategories? This cannot be undone.'))) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.CategoryService.delete(this.post)
            .subscribe({
                next: () => {
                    const title = this.TranslocoService.translate('Category');
                    const msg = this.TranslocoService.translate('Deleted successfully');
                    const url = ['mobile', 'category', 'list'];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(url);
                },
                error: (error) => {
                    this.handleError(error.error.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }

    public edit(): void {
        this.lockButtons();

        this.Subscription.add(
            this.CategoryService.patch({
                // Only the editable fields: view() also returns the related transactions, budgets, …
                id: this.post.id,
                emoji: this.post.emoji,
                name: this.post.name,
                parent_id: this.post.parent_id ?? null,
            } as Category).subscribe({
                next: (response: ApiEditResponse<Category>) => {
                    const title = this.TranslocoService.translate('Category');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['mobile', 'category', 'list'];

                    this.errors = undefined;
                    this.post = response.item;

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.handleError(error.error.error);
                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                }
            })
        );
    }
}
