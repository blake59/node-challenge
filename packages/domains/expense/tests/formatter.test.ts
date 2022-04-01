import { format, secureTrim } from '../formatter';

describe('[Packages | Expenses-domain | Formatter] secureTrim', () => {
  test('secureTrim should remove fields that are not defined in the list of public fields', () => {
    return expect(secureTrim({
      start: 0,
      total: 100,
      expenses: [
        {
          merchant_name: 'BRUS',
          amount_in_cents: 5000,
          currency: 'DKK',
          user_id: '3d16547a-79f6-4f62-9034-d3bfb31fb37c',
          status: 'processed',
          id: 'RANDOM_ID',
          date_created: '2021-09-18 20:57:40.021428',
        },
      ],
      randomField: 1234,
    } as any))
      .toEqual(JSON.stringify({
        total: 100,
        start: 0,
        expenses: [
          {
            merchant_name: 'BRUS',
            amount_in_cents: 5000,
            currency: 'DKK',
            user_id: '3d16547a-79f6-4f62-9034-d3bfb31fb37c',
            date_created: '2021-09-18 20:57:40.021428',
            status: 'processed',
          },
        ],
      }));
  });
});

describe('[Packages | Expenses-domain | Formatter] format', () => {
  test('format should return an instance of users that fits the API model, based on the db raw value', () => {
    return expect(format([
      {
        merchant_name: 'BRUS',
        amount_in_cents: 5000,
        currency: 'DKK',
        user_id: '3d16547a-79f6-4f62-9034-d3bfb31fb37c',
        status: 'processed',
        id: 'RANDOM_ID',
        date_created: '2021-09-18 20:57:40.021428',
      },
    ]))
      .toEqual([
        {
          merchant_name: 'BRUS',
          amount_in_cents: 5000,
          currency: 'DKK',
          user_id: '3d16547a-79f6-4f62-9034-d3bfb31fb37c',
          status: 'processed',
          id: 'RANDOM_ID',
          date_created: '2021-09-18 20:57:40.021428',
        },
      ]);
  });
});
