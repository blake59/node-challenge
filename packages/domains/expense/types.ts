export interface Expense {
    id: string
    merchant_name: string
    amount_in_cents: number
    currency: string
    user_id: string
    date_created: string
    status: string
}

export interface ExpensesResponse {
    start: number
    total: number
    expenses: Expense[]
}

export interface ExpenseFilters {
    status?: string
    merchant_name?: string
    currency?: string
}
