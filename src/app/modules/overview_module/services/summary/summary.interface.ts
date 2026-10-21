import {Transaction} from "../../../../services/transaction/transaction.interface";
import {Account} from "../../../../services/account/account.interface";

export interface SummaryRequest {
    AccountIds: number[],
    from: string,
    to: string
}


export interface SummaryResponse {
    summary: Summary
}

export interface ClosingBalanceSummaryResponse {
    summary: ClosingBalanceSummary
}

export interface Summary {
    Accounts: Account[]
    Transactions: Transaction[]
}

export interface ClosingBalance {
    account_id: number,
    year: number,
    month: number,
    balance_value: number
    [key: number]: number
}

export interface ClosingBalanceSummary {
    Accounts: Account[]
    ClosingBalances: ClosingBalance[]
}