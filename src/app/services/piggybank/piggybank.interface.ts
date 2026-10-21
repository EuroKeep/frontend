import {AbstractObject} from "../abstract/abstract.interface";
import {Currency} from "../currency/currency.interface";


export interface Piggybank extends AbstractObject {
    account_id: number
    name: string
    balance_value: number
    balance_currency: Currency
    start: string
    end: string
    target: number
    description: string
}

export interface PiggybankSavePost {
    transaction_id: number
    parts: {
        [key: number]: number
    }
}