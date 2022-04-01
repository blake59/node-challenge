import { ApiError } from '@nc/utils/errors';
import { getExpenses } from '../model';
import { Router } from 'express';
import { secureTrim } from '../formatter';
import { to } from '@nc/utils/async';

const { query, validationResult } = require('express-validator');

export const router = Router();

function getFiltersFromQuery(req) {
  const { status, merchant_name, currency } = req.query;

  return {
    status,
    merchant_name,
    currency,
  };
}

router.get(
  '/get-user-expenses',
  query('userId')
    .not()
    .isEmpty()
    .trim(),
  query('status')
    .optional()
    .isString()
    .trim(),
  query('merchant_name')
    .optional()
    .isString()
    .trim(),
  query('currency')
    .optional()
    .isString()
    .trim(),
  query('sortBy')
    .optional()
    .isString()
    .trim(),
  query('sortByOrder')
    .optional()
    .isString()
    .isIn(['ASC', 'DESC'])
    .trim(),
  query('start')
    .optional()
    .isInt({ min: 0 })
    .toInt(),
  query('count')
    .optional()
    .isNumeric()
    .toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({ errors: errors.array() });
    }

    const { userId, sortBy, sortByOrder, start, count } = req.query;
    const queryValues = getFiltersFromQuery(req);
    const [expensesError, expenses] = await to(getExpenses(userId, queryValues, sortBy as string, sortByOrder as string, start && Number(start), count && Number(count)));

    if (expensesError) {
      return next(new ApiError(expensesError, expensesError.status, `Could not get user details: ${expensesError}`, expensesError.title, req));
    }

    return res.json(secureTrim(expenses));
  }
);
