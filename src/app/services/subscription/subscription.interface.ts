import {AbstractHttpResponse, AbstractObject} from "../abstract/abstract.interface";
import {Account} from "../account/account.interface";
import {Category} from "../category/category.interface";
import {Paymentmethod} from "../paymentmethod/paymentmethod.interface";


export interface Subscription extends AbstractObject {
    name: string
    balance_value: number
    interval: string
    start: string
    end: string
    term: string
    logo: string
    noticeperiod: string
    description: string
    comments: string
    account_id: string
    account?: Account
    category_id: number
    category?: Category
    paymentmethod_id : number
    payment_method?: Paymentmethod
}

export interface SubscriptionStats {
    count: number
    count_without_interval: number
    monthly_total: number
    annual_total: number
    daily_total : number
    monthly_average: number
    most_expensive: {
        subscription: Subscription,
        monthly_cost: number
    }
    cheapest: {
        subscription: Subscription,
        monthly_cost: number
    }
}

export interface SubscriptionStatsResponse extends AbstractHttpResponse {
    statistics: SubscriptionStats;
}

export interface SubscriptionForecast extends Subscription {
    execution: string
}

export interface SubscriptionForecastResponse extends AbstractHttpResponse {
    forecast: SubscriptionForecast[]
}

