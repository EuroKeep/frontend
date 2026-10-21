import {AbstractObject} from "../abstract/abstract.interface";


export interface Paymentmethod extends AbstractObject {
    name: string
    image: string | null // `upload/<file>` = uploaded via upload-logo, see PaymentmethodService.logoUrl()
}

// Bit 1 of `flags`: only active payment methods are offered when choosing one (e.g. for subscriptions).
export const PaymentmethodFlagActive: number = 1;

export const PaymentmethodStates: any[] = [
    {id: 1, name: 'Active'},
    {id: 0, name: 'Inactive'},
] as const
