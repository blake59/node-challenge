import { Api } from '../utils/api';

describe('Given that we get expenses param validation is correct', () => {
  describe('Get Expenses', () => {
    test('Get Expenses route should return positively', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37c')
        .expect(200, done);
    });

    test('Get Expenses route should fail if no userId is provided', (done) => {
      Api.get('/expense/v1/get-user-expenses')
        .expect(400, done);
    });

    test('Get Expenses route should fail if sortByOrder is not ASC or DESC', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37c&sortByOrder=ASC123')
        .expect(400, done);
    });

    test('Get Expenses route should fail if start is less than 0', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37c&start=-1')
        .expect(400, done);
    });

    test('Get Expenses route should return all values if start equal to 0', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37c&start=0')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(JSON.parse(res.body).expenses.length)
            .toBe(2);
          return done();
        });
    });

    test('Get Expenses route should return 1 value if start equal to 1', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37c&start=1')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(JSON.parse(res.body).expenses.length)
            .toBe(1);
          return done();
        });
    });

    test('Get Expenses route should return no values if user doesnt exist', (done) => {
      Api.get('/expense/v1/get-user-expenses?userId=3d16547a-79f6-4f62-9034-d3bfb31fb37a')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          expect(JSON.parse(res.body).total)
            .toBe('0');
          return done();
        });
    });
  });
});
