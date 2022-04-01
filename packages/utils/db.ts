import { Client } from 'pg';
import config from 'config';
import Logger from './logging';
import { LimitInfo, SortInfo } from './types';

const logger = Logger('warn');

let db;

export function connect() {
  db = new Client(config.db);
  return db.connect();
}

export async function query(queryString: string, parameters?: any) {
  if (!db) await connect();

  return db.query(queryString, parameters);
}

export function addFiltersToQuery(queryString: string, queryParams: any[], filters: { [key: string]: any }) {
  const { finalQueryString, finalParameters } = Object.keys(filters || {})
    .reduce((acc, value) => {
      const filterValue = filters[value];

      if (!filterValue) {
        return acc;
      }

      switch (typeof filterValue) {
        case 'string':
          acc.finalParameters.push(filterValue);
          acc.finalQueryString = `${acc.finalQueryString} and ${value} = $${acc.finalParameters.length}`;
          break;
        default:
          logger.warn(`Invalid filter value with type ${typeof filterValue}`);
      }

      return acc;
    }, { finalQueryString: queryString, finalParameters: queryParams });

  return {
    queryString: finalQueryString,
    queryParams: finalParameters,
  };
}

export function addSortToQuery(queryString: string, queryParams: any[], sortInfo: SortInfo) {
  if (sortInfo.sortBy) {
    queryString = `${queryString} ORDER BY ${sortInfo.sortBy} ${sortInfo.sortByOrder}`;
  }

  return {
    queryString,
    queryParams,
  };
}

export function addLimitToQuery(queryString: string, queryParams: any[], limitInfo: LimitInfo) {
  queryString = `${queryString} LIMIT ${limitInfo.count} OFFSET ${limitInfo.start}`;

  return {
    queryString,
    queryParams,
  };
}
