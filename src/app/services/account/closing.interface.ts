import {Currency} from "../currency/currency.interface";

export interface Closing {
    closing: number
    previous: number
    balance_currency: Currency
}
