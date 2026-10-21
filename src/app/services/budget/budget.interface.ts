import {AbstractObject} from "../abstract/abstract.interface";
import {Category} from "../category/category.interface";
import {Currency} from "../currency/currency.interface";


export interface Budget extends AbstractObject {
    name: string
    spent: number
    usage: number
    limit: number
    currency: Currency
    category_id: number
    category: Category | undefined
}

export interface BudgetTotal {
    spentValue: number
    spentPercent: number
    total: number
    freeValue: number
    freePercent: number
}