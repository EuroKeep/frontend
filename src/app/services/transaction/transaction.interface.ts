import {AbstractHttpResponse, AbstractObject, ApiIndexResponse} from "../abstract/abstract.interface";
import {Account} from "../account/account.interface";
import {Category} from "../category/category.interface";


export interface TransactionStreamResponse extends AbstractHttpResponse {
    transactions: Transaction[]
    account: Account
    settlement: Settlement
}

export interface TransactionIndexResponse extends ApiIndexResponse<Transaction> {
    total: number
    expenses: number
    revenues: number
}

export interface TransactionMappingResponse extends AbstractHttpResponse {
    transaction: Transaction
}

export interface Settlement {
    revenues: number
    expenses: number
    settlement: number
}

export interface Transaction extends AbstractObject {
    comment: string
    balance_value: number
    category_id: number
    account_id: number
    user_id: number
    category?: Category
    transfer_id?: number
    subscription_id: number | undefined
    account?: Account
}
