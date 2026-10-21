import {Routes} from '@angular/router';

export const EurokeepMobileModuleRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/user/login/user-login.component').then(m => m.UserLoginComponent),
    },
    {
        path: 'login/:demo',
        loadComponent: () => import('./pages/user/login/user-login.component').then(m => m.UserLoginComponent),
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'mobile',
        loadComponent: () => import('./pages/account/list/account-list.component').then(m => m.AccountListComponent),
    },
    {
        path: 'mobile/home',
        loadComponent: () => import('./pages/home/home/home.component').then(m => m.HomeComponent),
    },
    // ACCOUNT MOBILE
    {
        path: 'mobile/account/list',
        loadComponent: () => import('./pages/account/list/account-list.component').then(m => m.AccountListComponent),
    },
    {
        path: 'mobile/account/add',
        loadComponent: () => import('./pages/account/add/account-mobile-add.component').then(m => m.AccountMobileAddComponent),
    },
    {
        path: 'mobile/account/edit/:accountId',
        loadComponent: () => import('./pages/account/edit/account-mobile-edit.component').then(m => m.AccountMobileEditComponent),
    },
    {
        path: 'mobile/transaction/add/:accountId',
        loadComponent: () => import('./pages/transaction/add/transaction-mobile-add.component').then(m => m.TransactionMobileAddComponent),
    },
    {
        path: 'mobile/transaction/edit/:transactionId',
        loadComponent: () => import('./pages/transaction/edit/transaction-mobile-edit.component').then(m => m.TransactionMobileEditComponent),
    },
    // BUDGET MODULE
    {
        path: 'mobile/budget/list',
        loadComponent: () => import('./pages/budget/list/budget-list.component').then(m => m.BudgetListComponent),
    },
    {
        path: 'mobile/budget/list/:budgetId',
        loadComponent: () => import('./pages/budget/list/budget-list.component').then(m => m.BudgetListComponent),
    },
    {
        path: 'mobile/budget/add',
        loadComponent: () => import('./pages/budget/add/budget-mobile-add.component').then(m => m.BudgetMobileAddComponent),
    },
    {
        path: 'mobile/budget/edit/:budgetId',
        loadComponent: () => import('./pages/budget/edit/budget-mobile-edit.component').then(m => m.BudgetMobileEditComponent),
    },
    // SUBSCRIPTION MODULE
    {
        path: 'mobile/subscription/list',
        loadComponent: () => import('./pages/subscription/list/subscription-mobile-list.component').then(m => m.SubscriptionMobileListComponent),
    },
    {
        path: 'mobile/subscription/add',
        loadComponent: () => import('./pages/subscription/add/subscription-mobile-add.component').then(m => m.SubscriptionMobileAddComponent),
    },
    {
        path: 'mobile/subscription/edit/:subscriptionId',
        loadComponent: () => import('./pages/subscription/edit/subscription-mobile-edit.component').then(m => m.SubscriptionMobileEditComponent),
    },
    {
        path: 'mobile/transaction/stream/:accountId',
        loadComponent: () => import('./pages/transaction/stream/transaction-stream.component').then(m => m.TransactionStreamComponent),
    },
    // SAVING MODULE
    {
        path: 'mobile/saving/list',
        loadComponent: () => import('./pages/saving/list/saving-mobile-list.component').then(m => m.SavingMobileListComponent),
    },
    {
        path: 'mobile/saving/add',
        loadComponent: () => import('./pages/saving/add/saving-mobile-add.component').then(m => m.SavingMobileAddComponent),
    },
    {
        path: 'mobile/saving/save/:transactionId',
        loadComponent: () => import('./pages/saving/save/saving-mobile-save.component').then(m => m.SavingMobileSaveComponent),
    },
    {
        path: 'mobile/saving/edit/:savingId',
        loadComponent: () => import('./pages/saving/edit/saving-mobile-edit.component').then(m => m.SavingMobileEditComponent),
    },
    // ANALYZER
    {
        path: 'mobile/analyzer/transactions',
        loadComponent: () => import('./pages/analyzer/transactions/analyzer-transactions.component').then(m => m.AnalzerTransactionsComponent),
    },
    {
        path: 'mobile/analyzer/month',
        loadComponent: () => import('./pages/analyzer/month/analyzer-month.component').then(m => m.AnalyzerMonthComponent),
    },
    {
        path: 'mobile/analyzer/month/:year/:month',
        loadComponent: () => import('./pages/analyzer/month/analyzer-month.component').then(m => m.AnalyzerMonthComponent),
    },
    {
        path: 'mobile/analyzer/month/:year/:month/:categoryId',
        loadComponent: () => import('./pages/analyzer/month/analyzer-month.component').then(m => m.AnalyzerMonthComponent),
    },
    // SETTINGS
    {
        path: 'mobile/settings',
        loadComponent: () => import('./pages/settings/home/home.component').then(m => m.HomeComponent),
    },
    // CATEGORIES
    {
        path: 'mobile/category/list',
        loadComponent: () => import('./pages/category/list/category-list.component').then(m => m.CategoryListComponent),
    },
    {
        path: 'mobile/category/add',
        loadComponent: () => import('./pages/category/add/category-mobile-add.component').then(m => m.CategoryMobileAddComponent),
    },
    {
        path: 'mobile/category/edit/:categoryId',
        loadComponent: () => import('./pages/category/edit/category-mobile-edit.component').then(m => m.CategoryMobileEditComponent),
    },
    // ACCOUNT TYPES
    {
        path: 'mobile/accounttype/list',
        loadComponent: () => import('./pages/accounttype/list/accounttype-list.component').then(m => m.AccounttypeListComponent),
    },
    {
        path: 'mobile/accounttype/add',
        loadComponent: () => import('./pages/accounttype/add/accounttype-mobile-add.component').then(m => m.AccounttypeMobileAddComponent),
    },
    {
        path: 'mobile/accounttype/edit/:accounttypeId',
        loadComponent: () => import('./pages/accounttype/edit/accounttype-mobile-edit.component').then(m => m.AccounttypeMobileEditComponent),
    },
    // PAYMENT METHODS
    {
        path: 'mobile/paymentmethod/list',
        loadComponent: () => import('./pages/paymentmethod/list/paymentmethod-list.component').then(m => m.PaymentmethodListComponent),
    },
    {
        path: 'mobile/paymentmethod/add',
        loadComponent: () => import('./pages/paymentmethod/add/paymentmethod-mobile-add.component').then(m => m.PaymentmethodMobileAddComponent),
    },
    {
        path: 'mobile/paymentmethod/edit/:paymentmethodId',
        loadComponent: () => import('./pages/paymentmethod/edit/paymentmethod-mobile-edit.component').then(m => m.PaymentmethodMobileEditComponent),
    },
];
