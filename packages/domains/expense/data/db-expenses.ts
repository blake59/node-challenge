import { ExpenseFilters } from '../types';
import { addFiltersToQuery, addLimitToQuery, addSortToQuery, query } from '@nc/utils/db';
import { LimitInfo, SortInfo } from '@nc/utils/types';

const TABLE_NAME = 'expenses';

export const SUPPORTED_SORT_FIELDS = ['amount_in_cents', 'date_created'];

export async function readExpenses(userId: string, filters: ExpenseFilters, sortInfo: SortInfo, limitInfo: LimitInfo) {
  let queryString = `SELECT * FROM ${TABLE_NAME} WHERE user_id = $1`;
  let queryParams = [userId];

  ({ queryString, queryParams } = addFiltersToQuery(queryString, queryParams, filters));

  ({ queryString, queryParams } = addSortToQuery(queryString, queryParams, sortInfo));

  ({ queryString, queryParams } = addLimitToQuery(queryString, queryParams, limitInfo));

  const response = await query(queryString, queryParams);

  return response.rows;
}

export async function getTotalExpenses(userId: string, filters: ExpenseFilters) {
  const initialQueryString = `SELECT COUNT(*) FROM ${TABLE_NAME} WHERE user_id = $1`;
  const initialQueryParams = [userId];

  const { queryString, queryParams } = addFiltersToQuery(initialQueryString, initialQueryParams, filters);

  const response = await query(queryString, queryParams);

  return response.rows[0].count;
}
