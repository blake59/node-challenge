import { format } from './formatter';
import { to } from '@nc/utils/async';
import { BadRequest, InternalError } from '@nc/utils/errors';
import { ExpenseFilters, ExpensesResponse } from './types';
import { getTotalExpenses, readExpenses, SUPPORTED_SORT_FIELDS } from './data/db-expenses';

export async function getExpenses(userId, queryValues: ExpenseFilters, sortBy: string, sortByOrder: string = 'ASC', start: number = 0, count: number = 100): Promise<ExpensesResponse> {
  if (!userId) {
    throw BadRequest('userId property is missing.');
  }

  if (sortBy && !SUPPORTED_SORT_FIELDS.includes(sortBy)) {
    throw BadRequest(`cannot sort expenses by field with name ${sortBy}`);
  }

  if (count > 100) {
    count = 100;
  }

  const [dbError, rawExpenses] = await to(readExpenses(userId, queryValues, { sortBy, sortByOrder }, { start, count }));

  if (dbError) {
    throw InternalError(`Error fetching data from the DB: ${dbError.message}`);
  }

  const [dbError2, expensesCount] = await to(getTotalExpenses(userId, queryValues));

  if (dbError2) {
    throw InternalError(`Error fetching data from the DB: ${dbError2.message}`);
  }

  return {
    expenses: format(rawExpenses),
    start,
    total: expensesCount,
  };
}
