import {AbstractHttpResponse, AbstractObject} from "../abstract/abstract.interface";
import {Transaction} from "../transaction/transaction.interface";
import {OptionLabelFn} from "../../components/form/select-component/select-component.component";

export interface CategoryTreeResponse extends AbstractHttpResponse {
    categoryTree: Category[]
}

export interface Category extends AbstractObject {
    name: string
    emoji: string
    parent_id: number | null
    lft: number
    rght: number
    transactions: Transaction[] | undefined
    children: Category[]
}

// Body of /categories/move: new parent (null = root) and zero-based position among its children.
export interface CategoryMove {
    parent_id: number | null
    position: number
}

// One Category of the tree in depth-first order, as used for flat (indented) lists.
export interface CategoryTreeRow {
    Category: Category
    depth: number
    position: number // zero-based index among its siblings
}

/**
 * Flattens the threaded /categories/tree response depth-first. Optionally leaves out one Category
 * including all of its descendants (e.g. to offer only valid parents when editing it).
 */
export function flattenCategoryTree(tree: Category[], excludeId: number | null = null, depth: number = 0): CategoryTreeRow[] {
    const rows: CategoryTreeRow[] = [];
    tree.filter((Category: Category) => Category.id !== excludeId)
        .forEach((Category: Category, position: number) => {
            rows.push({Category, depth, position});
            rows.push(...flattenCategoryTree(Category.children ?? [], excludeId, depth + 1));
        });
    return rows;
}

/**
 * I will output the Category's label with the Emoji, the title and the parent category in parenthesis:
 *
 * ⛽ Gas (Bike)
 * 🥖 Bakery (Groceries)
 * @param categories
 */
export function categoryOptionLabel(categories: Category[]): OptionLabelFn<Category> {
    const byId = new Map<number, Category>(categories.map((category: Category) => [category.id, category]));
    return (category: Category) => {
        const label = category.emoji ? `${category.emoji} ${category.name}` : category.name;
        const parent = category.parent_id !== null ? byId.get(category.parent_id) : undefined;
        return parent ? `${label} (${parent.name})` : label;
    };
}
