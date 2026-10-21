import {AbstractHttpResponse} from "../abstract/abstract.interface";
import {Currency} from "../currency/currency.interface";

export interface Networth extends AbstractHttpResponse {
    balance_currency: Currency,
    balance_value: number
}