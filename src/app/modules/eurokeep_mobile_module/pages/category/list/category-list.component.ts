import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
import {
    ButtonDirective,
    ButtonGroupComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import {RouterLink} from "@angular/router";
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDragMove,
    CdkDragPreview,
    CdkDropList,
    moveItemInArray
} from "@angular/cdk/drag-drop";
import {AbstractIndexComponent} from "../../../../account_module/pages/abstract-index/abstract-index.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CategoryService} from "../../../../../services/category/category.service";
import {
    Category,
    CategoryMove,
    CategoryTreeResponse,
    CategoryTreeRow,
    flattenCategoryTree
} from "../../../../../services/category/category.interface";
import {ApiEditResponse} from "../../../../../services/abstract/abstract.interface";

@Component({
    selector: 'category-list',
    imports: [
        TranslocoDirective,
        RouterLink,
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        ButtonDirective,
        FaIconComponent,
        ButtonGroupComponent,
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
        CdkDragPreview,
    ],
    templateUrl: './category-list.component.html',
    styleUrl: './category-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent extends AbstractIndexComponent {
    // Inject Service
    protected override CrudService: CategoryService = inject(CategoryService);

    // The tree, flattened depth-first. Nesting is expressed by the indentation (depth).
    protected override Items: CategoryTreeRow[] = [];

    // Horizontal drag distance that equals one level of nesting.
    protected readonly IndentPx: number = 24;

    // Drag state
    protected DraggedRow: CategoryTreeRow | null = null;
    protected DragTargetDepth: number = 0;

    protected override index(): void {
        this.lockButtons();
        this.Subscription.add(this.CrudService.tree().subscribe({
            next: (response: CategoryTreeResponse) => {
                this.Items = flattenCategoryTree(response.categoryTree);
                this.afterIndex(response);
            },
            error: (error) => this.handleError(error?.error?.error)
        }));
    }

    protected dragStarted(Row: CategoryTreeRow): void {
        this.DraggedRow = Row;
        this.DragTargetDepth = Row.depth;
        this.ChangeDetectorRef.markForCheck();
    }

    protected dragMoved(event: CdkDragMove<CategoryTreeRow>): void {
        // Only a hint for the preview, the valid depth depends on the drop position (see drop()).
        const depth = Math.max(0, event.source.data.depth + this.depthDelta(event.distance.x));
        if (depth !== this.DragTargetDepth) {
            this.DragTargetDepth = depth;
            this.ChangeDetectorRef.markForCheck();
        }
    }

    protected dragEnded(): void {
        this.DraggedRow = null;
        this.ChangeDetectorRef.markForCheck();
    }

    // The descendants of the dragged Category move along with it.
    protected isInDraggedSubtree(Row: CategoryTreeRow): boolean {
        return this.DraggedRow !== null && this.subtreeOf(this.DraggedRow).includes(Row) && Row !== this.DraggedRow;
    }

    protected drop(event: CdkDragDrop<CategoryTreeRow[], CategoryTreeRow[], CategoryTreeRow>): void {
        const dragged: CategoryTreeRow = event.item.data;
        const subtree: CategoryTreeRow[] = this.subtreeOf(dragged);

        // New order as the CDK sees it (only the dragged row moved), without the dragged subtree.
        const order: CategoryTreeRow[] = [...this.Items];
        moveItemInArray(order, event.previousIndex, event.currentIndex);
        const index: number = order.indexOf(dragged);
        const before: CategoryTreeRow[] = order.slice(0, index).filter((Row) => !subtree.includes(Row));
        const after: CategoryTreeRow[] = order.slice(index + 1).filter((Row) => !subtree.includes(Row));
        const above: CategoryTreeRow | undefined = before[before.length - 1];
        const below: CategoryTreeRow | undefined = after[0];

        // At most one level deeper than the row above, at least as deep as the row below.
        const maxDepth: number = above ? above.depth + 1 : 0;
        const minDepth: number = below ? below.depth : 0;
        const depth: number = Math.min(maxDepth, Math.max(minDepth, dragged.depth + this.depthDelta(event.distance.x)));

        // Parent = closest row above with depth - 1, position = number of siblings in between.
        let parent: Category | null = null;
        let position: number = 0;
        for (let i = before.length - 1; i >= 0; i--) {
            if (before[i].depth < depth) {
                parent = before[i].Category;
                break;
            }
            if (before[i].depth === depth) {
                position++;
            }
        }

        const move: CategoryMove = {parent_id: parent ? parent.id : null, position};
        if (move.parent_id === (dragged.Category.parent_id ?? null) && move.position === dragged.position) {
            return;
        }

        this.lockButtons();
        this.Subscription.add(this.CrudService.move(dragged.Category, move).subscribe({
            next: (response: ApiEditResponse<Category>) => {
                const title = this.TranslocoService.translate('Category');
                const msg = this.TranslocoService.translate('moved successfully');
                this.NotyService.genericSuccess(msg, title + ' ' + response.item.name);
                this.index();
            },
            error: (error) => {
                this.handleError(error?.error?.error);
                this.index();
            }
        }));
    }

    private depthDelta(distanceX: number): number {
        return Math.round(distanceX / this.IndentPx);
    }

    // The given row and all rows directly following it that are nested deeper.
    private subtreeOf(Row: CategoryTreeRow): CategoryTreeRow[] {
        const start: number = this.Items.indexOf(Row);
        let end: number = start + 1;
        while (end < this.Items.length && this.Items[end].depth > Row.depth) {
            end++;
        }
        return this.Items.slice(start, end);
    }
}
