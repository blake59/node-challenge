# Node Challenge

## Expenses API Documentation

### GET /expense/v1/get-user-expenses
QueryParams:
* userId (required) - The id of the user we want the expenses from;
* status (optional) - Used to filter the returned expenses by status;
* merchant_name (optional) - Used to filter the returned expenses by merchant name;
* currency (optional) - Used to filter the returned expenses by currency;
* sortBy (optional) - Used to sort the returned expenses by the given field, supported fields are amount_in_cents and date_created;
* sortByOrder (optional) - Used to specify the sort order, supported values are ASC, DESC. Defaults to ASC if not provided;
* start (optional) - Used to select how many expenses we want to skip, useful for pagination. Defaults to 0 if not provided;
* count (optional) - Used to select the number of expenses we want to receive. Defaults to 100 if no value or value is greater than 100;

This endpoint will return the following response on success:
```
    {
        total: 100,
        start: 0,
        expenses: [
          {
            merchant_name: 'BRUS',
            amount_in_cents: 5000,
            currency: 'DKK',
            user_id: '3d16547a-79f6-4f62-9034-d3bfb31fb37c',
            date_created: '2021-09-18 20:57:40.021428',
            status: 'processed'
          }
        ]
    }
```
This endpoint will not return more than 100 expenses at the same time.




## Notes about implementation

1. I debated between implementing this endpoint as a get or as a post just for the fact that I believe that if this endpoint
was used for production sooner or later it would be changed to a post to allow more complex filters, which would be hard to do on a GET.
2. I could have allowed for all fields to be filtered and sortable, but I believe the ones i implemented were the most important ones.
3. The integration/acceptance tests were a bit lacking and there were a lot more combinations of parameters that i could have done, they were 
also done under the assumption that the database would be populated with the dump.sql.

Future improvements
1. Improve error handling - currently exceptions and stack traces are being sent to the client, including database stack trades, which should not happen.
The reason this should not happen because application should not expose possible sensitive information and the client should whenever possible be presented
with a clear error, and when possible should allow them to fix the problem alone.
2. Improve the query creation - currently there is a security problem with the way the sql query is being generating allowing for
jql injection. Possibly using the module http://knexjs.org/ could help solve this problem.
3. JWT tokens - depending on the access control it might not make sense for a user to be able to get the expenses from another user, so my suggestion here
is to add JWT tokens to the requests which should contain information about which user is making the request, and then we could check if that user has the required
permissions to access the other user expenses.
4. Logging/error reporting - another thing that I would like to improve is the logging I believe is very useful to have logging for each request knowing when it started and finished
and also how much time it took. Another thing I find important is to have the errors be reported to tools like Sentry, this way we can get alerts and it's easier to identify problems. Sentry also 
provides a service to give metrics about requests which I believe are also very important.







