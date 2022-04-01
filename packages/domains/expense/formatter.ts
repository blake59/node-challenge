import { Expense, ExpensesResponse } from './types';

const publicFields = ['merchant_name', 'amount_in_cents', 'currency', 'user_id', 'date_created', 'status', 'total', 'start', 'expenses'];

export function secureTrim(expenses: ExpensesResponse): string {
  return JSON.stringify(expenses, publicFields);
}

export function format(rawExpenses: Expense[]): Expense[] {
  return rawExpenses.map((rawExpense) => {
    return {
      id: rawExpense.id,
      merchant_name: rawExpense.merchant_name,
      amount_in_cents: rawExpense.amount_in_cents,
      currency: rawExpense.currency,
      user_id: rawExpense.user_id,
      date_created: rawExpense.date_created,
      status: rawExpense.status,
    };
  });
}
