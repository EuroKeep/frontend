import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    FormDirective,
    RowComponent
} from '@coreui/angular';
import {InputComponent} from "../../../../../components/form/input-component/input-component";
import {SpamsaveDirective} from "../../../../../directives/spamsave.directive";
import {AbstractPageComponent} from "../../abstract/abstract-page.component";
import {CategoryService} from "../../../../../services/category/category.service";
import {
    Category,
    CategoryTreeResponse,
    CategoryTreeRow,
    flattenCategoryTree
} from "../../../../../services/category/category.interface";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {SelectComponent} from "../../../../../components/form/select-component/select-component.component";
import {ApiAddResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'category-add',
    imports: [
        TranslocoDirective,
        ReactiveFormsModule,
        FormsModule,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        FormDirective,
        InputComponent,
        SpamsaveDirective,
        ColComponent,
        FaIconComponent,
        RowComponent,
        RouterLink,
        ButtonGroupComponent,
        SelectComponent,
    ],
    templateUrl: './category-mobile-add.component.html',
    styleUrl: './category-mobile-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryMobileAddComponent extends AbstractPageComponent {
    protected readonly CategoryService: CategoryService = inject(CategoryService);

    protected post: Category = {parent_id: null} as Category;
    protected categoryId: number | null = null;
    protected ParentCategories: any[] = [];

    override ngOnInit() {
        // Possible parents: the whole tree, indented by depth. When editing, the Category itself and
        // its descendants are left out, a Category cannot become its own (grand)child.
        this.Subscription.add(this.CategoryService.tree().subscribe({
            next: (result: CategoryTreeResponse) => {
                this.ParentCategories = flattenCategoryTree(result.categoryTree, this.categoryId)
                    .map((row: CategoryTreeRow) => ({
                        id: row.Category.id,
                        emoji: '\u00a0\u00a0'.repeat(row.depth) + row.Category.emoji,
                        name: row.Category.name,
                    }));
                this.ChangeDetectorRef.markForCheck();
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
        super.ngOnInit();
    }

    public add(): void {
        this.lockButtons();

        this.Subscription.add(
            this.CategoryService.add({...this.post, parent_id: this.post.parent_id ?? null}).subscribe({
                next: (response: ApiAddResponse<Category>) => {
                    const title = this.TranslocoService.translate('Category');
                    const msg = this.TranslocoService.translate('added successfully');
                    const url = ['mobile', 'category', 'edit', response.item.id];

                    this.NotyService.scrollContentDivToTop();
                    this.NotyService.genericSuccess(msg, title, url);

                    this.errors = undefined;

                    this.unlockButtons();
                    this.ChangeDetectorRef.markForCheck();
                    this.Router.navigate(['mobile', 'category', 'list']);
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
