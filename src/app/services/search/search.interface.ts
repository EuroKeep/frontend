import {Account} from "../account/account.interface";
import {Transaction} from "../transaction/transaction.interface";
import {Budget} from "../budget/budget.interface";
import {Piggybank} from "../piggybank/piggybank.interface";
import {Subscription} from "../subscription/subscription.interface";


export interface SearchApiResponse {
    items: {

        accounts: Account[]
        transactions: Transaction[]
        budgets: Budget[]
        piggybanks: Piggybank[]
        subscriptions: Subscription[]
    }
}
