export enum Currency {

    /* EUROPE */
    eur = 'eur',/* 🇪🇺 EUROZONE */
    gbp = 'gbp',/* 🇬🇧 UNITED KINGDOM */
    chf = 'chf',/* 🇨🇭 SWITZERLAND */
    sek = 'sek',/* 🇸🇪 SWEDEN */
    nok = 'nok',/* 🇳🇴 NORWAY */
    dkk = 'dkk',/* 🇩🇰 DENMARK */
    isk = 'isk',/* 🇮🇸 ICELAND */
    pln = 'pln',/* 🇵🇱 POLAND */
    czk = 'czk',/* 🇨🇿 CZECH REPUBLIC */
    huf = 'huf',/* 🇭🇺 HUNGARY */
    ron = 'ron',/* 🇷🇴 ROMANIA */
    bgn = 'bgn',/* 🇧🇬 BULGARIA */
    uah = 'uah',/* 🇺🇦 UKRAINE */
    try = 'try',/* 🇹🇷 TURKEY */

    /* DOLLAR-BASED */
    usd = 'usd',/* 🇺🇸 UNITED STATES */
    cad = 'cad',/* 🇨🇦 CANADA */
    aud = 'aud',/* 🇦🇺 AUSTRALIA */
    nzd = 'nzd',/* 🇳🇿 NEW ZEALAND */

    /* ASIA */
    jpy = 'jpy',/* 🇯🇵 JAPAN */
    cny = 'cny',/* 🇨🇳 CHINA */
    krw = 'krw',/* 🇰🇷 SOUTH KOREA */
    inr = 'inr',/* 🇮🇳 INDIA */
    php = 'php',/* 🇵🇭 PHILIPPINES */
    thb = 'thb',/* 🇹🇭 THAILAND */

    /* AMERICAS */
    mxn = 'mxn',/* 🇲🇽 MEXICO */
    brl = 'brl',/* 🇧🇷 BRAZIL */
    ars = 'ars',/* 🇦🇷 ARGENTINA */
    clp = 'clp',/* 🇨🇱 CHILE */
    cop = 'cop',/* 🇨🇴 COLOMBIA */

    /* MIDDLE EAST / AFRICA */
    ils = 'ils',/* 🇮🇱 ISRAEL */
    aed = 'aed',/* 🇦🇪 UNITED ARAB EMIRATES */
    sar = 'sar',/* 🇸🇦 SAUDI ARABIA */
    egp = 'egp',/* 🇪🇬 EGYPT */
    zar = 'zar',/* 🇿🇦 SOUTH AFRICA */
    ngn = 'ngn',/* 🇳🇬 NIGERIA */
    kes = 'kes',/* 🇰🇪 KENYA */

    /* ASIA / PACIFIC */
    idr = 'idr',/* 🇮🇩 INDONESIA */
    vnd = 'vnd',/* 🇻🇳 VIETNAM */
    myr = 'myr',/* 🇲🇾 MALAYSIA */
    twd = 'twd',/* 🇹🇼 TAIWAN */
    pkr = 'pkr',/* 🇵🇰 PAKISTAN */
    bdt = 'bdt',/* 🇧🇩 BANGLADESH */
    lkr = 'lkr',/* 🇱🇰 SRI LANKA */

    /* CRYPTO */
    btc = 'btc',

}

export function formatBalance(value: number, currency: Currency): string {
    const decimals = currency === Currency.btc ? 8 : 2;
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}
export function formatCurrency(value: number, currency: Currency): string {
    return formatBalance(value, currency) + currency;
}