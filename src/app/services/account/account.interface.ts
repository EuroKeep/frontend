import {AbstractObject} from "../abstract/abstract.interface";
import {Currency} from "../currency/currency.interface";


export interface TotalBalance {
    currency: Currency
    value: number
}

export interface Account extends AbstractObject {
    name: string
    emoji: string
    iban: string
    balance_value: number
    balance_currency: Currency
    balance_value_closing : number
    accounttype_id: number
    user_id: number
}


export const Currencies : any[]= [
    /* EUROPE */
    { id: 'eur', symbol: '€', text: 'Euro', flag: '🇪🇺', name: '🇪🇺 EUR — Euro' },
    { id: 'gbp', symbol: '£', text: 'British Pound', flag: '🇬🇧', name: '🇬🇧 GBP — British Pound' },
    { id: 'chf', symbol: 'CHF', text: 'Swiss Franc', flag: '🇨🇭', name: '🇨🇭 CHF — Swiss Franc' },
    { id: 'sek', symbol: 'kr', text: 'Swedish Krona', flag: '🇸🇪', name: '🇸🇪 SEK — Swedish Krona' },
    { id: 'nok', symbol: 'kr', text: 'Norwegian Krone', flag: '🇳🇴', name: '🇳🇴 NOK — Norwegian Krone' },
    { id: 'dkk', symbol: 'kr', text: 'Danish Krone', flag: '🇩🇰', name: '🇩🇰 DKK — Danish Krone' },
    { id: 'isk', symbol: 'kr', text: 'Icelandic Króna', flag: '🇮🇸', name: '🇮🇸 ISK — Icelandic Króna' },
    { id: 'pln', symbol: 'zł', text: 'Polish Złoty', flag: '🇵🇱', name: '🇵🇱 PLN — Polish Złoty' },
    { id: 'czk', symbol: 'Kč', text: 'Czech Koruna', flag: '🇨🇿', name: '🇨🇿 CZK — Czech Koruna' },
    { id: 'huf', symbol: 'Ft', text: 'Hungarian Forint', flag: '🇭🇺', name: '🇭🇺 HUF — Hungarian Forint' },
    { id: 'ron', symbol: 'lei', text: 'Romanian Leu', flag: '🇷🇴', name: '🇷🇴 RON — Romanian Leu' },
    { id: 'bgn', symbol: 'лв', text: 'Bulgarian Lev', flag: '🇧🇬', name: '🇧🇬 BGN — Bulgarian Lev' },
    { id: 'uah', symbol: '₴', text: 'Ukrainian Hryvnia', flag: '🇺🇦', name: '🇺🇦 UAH — Ukrainian Hryvnia' },
    { id: 'try', symbol: '₺', text: 'Turkish Lira', flag: '🇹🇷', name: '🇹🇷 TRY — Turkish Lira' },

    /* DOLLAR-BASED */
    { id: 'usd', symbol: '$', text: 'US Dollar', flag: '🇺🇸', name: '🇺🇸 USD — US Dollar' },
    { id: 'cad', symbol: '$', text: 'Canadian Dollar', flag: '🇨🇦', name: '🇨🇦 CAD — Canadian Dollar' },
    { id: 'aud', symbol: '$', text: 'Australian Dollar', flag: '🇦🇺', name: '🇦🇺 AUD — Australian Dollar' },
    { id: 'nzd', symbol: '$', text: 'New Zealand Dollar', flag: '🇳🇿', name: '🇳🇿 NZD — New Zealand Dollar' },

    /* ASIA */
    { id: 'jpy', symbol: '¥', text: 'Japanese Yen', flag: '🇯🇵', name: '🇯🇵 JPY — Japanese Yen' },
    { id: 'cny', symbol: '¥', text: 'Chinese Yuan', flag: '🇨🇳', name: '🇨🇳 CNY — Chinese Yuan' },
    { id: 'krw', symbol: '₩', text: 'South Korean Won', flag: '🇰🇷', name: '🇰🇷 KRW — South Korean Won' },
    { id: 'inr', symbol: '₹', text: 'Indian Rupee', flag: '🇮🇳', name: '🇮🇳 INR — Indian Rupee' },
    { id: 'php', symbol: '₱', text: 'Philippine Peso', flag: '🇵🇭', name: '🇵🇭 PHP — Philippine Peso' },
    { id: 'thb', symbol: '฿', text: 'Thai Baht', flag: '🇹🇭', name: '🇹🇭 THB — Thai Baht' },

    /* AMERICAS */
    { id: 'mxn', symbol: '$', text: 'Mexican Peso', flag: '🇲🇽', name: '🇲🇽 MXN — Mexican Peso' },
    { id: 'brl', symbol: 'R$', text: 'Brazilian Real', flag: '🇧🇷', name: '🇧🇷 BRL — Brazilian Real' },
    { id: 'ars', symbol: '$', text: 'Argentine Peso', flag: '🇦🇷', name: '🇦🇷 ARS — Argentine Peso' },
    { id: 'clp', symbol: '$', text: 'Chilean Peso', flag: '🇨🇱', name: '🇨🇱 CLP — Chilean Peso' },
    { id: 'cop', symbol: '$', text: 'Colombian Peso', flag: '🇨🇴', name: '🇨🇴 COP — Colombian Peso' },

    /* MIDDLE EAST / AFRICA */
    { id: 'ils', symbol: '₪', text: 'Israeli New Shekel', flag: '🇮🇱', name: '🇮🇱 ILS — Israeli New Shekel' },
    { id: 'aed', symbol: 'د.إ', text: 'UAE Dirham', flag: '🇦🇪', name: '🇦🇪 AED — UAE Dirham' },
    { id: 'sar', symbol: '﷼', text: 'Saudi Riyal', flag: '🇸🇦', name: '🇸🇦 SAR — Saudi Riyal' },
    { id: 'egp', symbol: '£', text: 'Egyptian Pound', flag: '🇪🇬', name: '🇪🇬 EGP — Egyptian Pound' },
    { id: 'zar', symbol: 'R', text: 'South African Rand', flag: '🇿🇦', name: '🇿🇦 ZAR — South African Rand' },
    { id: 'ngn', symbol: '₦', text: 'Nigerian Naira', flag: '🇳🇬', name: '🇳🇬 NGN — Nigerian Naira' },
    { id: 'kes', symbol: 'KSh', text: 'Kenyan Shilling', flag: '🇰🇪', name: '🇰🇪 KES — Kenyan Shilling' },

    /* ASIA / PACIFIC */
    { id: 'idr', symbol: 'Rp', text: 'Indonesian Rupiah', flag: '🇮🇩', name: '🇮🇩 IDR — Indonesian Rupiah' },
    { id: 'vnd', symbol: '₫', text: 'Vietnamese Dong', flag: '🇻🇳', name: '🇻🇳 VND — Vietnamese Dong' },
    { id: 'myr', symbol: 'RM', text: 'Malaysian Ringgit', flag: '🇲🇾', name: '🇲🇾 MYR — Malaysian Ringgit' },
    { id: 'twd', symbol: 'NT$', text: 'New Taiwan Dollar', flag: '🇹🇼', name: '🇹🇼 TWD — New Taiwan Dollar' },
    { id: 'pkr', symbol: '₨', text: 'Pakistani Rupee', flag: '🇵🇰', name: '🇵🇰 PKR — Pakistani Rupee' },
    { id: 'bdt', symbol: '৳', text: 'Bangladeshi Taka', flag: '🇧🇩', name: '🇧🇩 BDT — Bangladeshi Taka' },
    { id: 'lkr', symbol: 'Rs', text: 'Sri Lankan Rupee', flag: '🇱🇰', name: '🇱🇰 LKR — Sri Lankan Rupee' },

    /* CRYPTO */
    { id: 'btc', symbol: '₿', text: 'Bitcoin', flag: '₿', name: '₿ BTC — Bitcoin' }
] as const
