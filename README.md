
# VRIFY test REST app.

this is an app to test CRUD actions in an API environment for the question:

Based on the table information in Question 2, write a REST based javascript service (any framework of your choice) which interfaces with these tables. Write any associated unit tests necessary.

## SYSTEM REQUIREMENTS

1. Node 10+
2. MySQL 5.0.12
3. 2 MySQL tables set to the following:

    Customers:

    | ID | NAME     |
    |----|----------|
    | 1  | Ryan     |
    | 2  | Jonathan |
    | 3  | Colin    |
    | 4  | Syed     |

    Customer_Addresses:

    | ID | CUSTOMER_ID | STREET_ADDRESS         | POSTAL_CODE | COUNTRY |
    |----|-------------|------------------------|-------------|---------|
    | 1  | 2           | 123 Big Walk Way       | 75023       | US      |
    | 2  | 3           | 509 Charter Road       | 90021       | US      |
    | 3  | 1           | 999 Night Stalker Road | 12345       | US      |

    **please note, all varchar**
    *ids set to not null primary key auto_increment*

## HOW TO USE

run `npm install` then run `npm run app` to start the server. you will be able to connect using at `http://localhost` + your chosen port (or PORT 3000 if no port specified in env)

the app will then work in your favourite browser or on postman.

there are no routes, just verbs, so you can type localhost + port + anything you want as the URL
the api is set to take both query string and body parameters as input data and it will just search the database with the keys provided

it can handle 4 verbs: GET, POST, PUT, DELETE

GET:
will get all results (that appear in both tables) if empty or can be narrowed down if input params used

POST:
will insert a record to the database based upon input

PUT:
will update any supplied data (requires an ID)

DELETE:
will delete based on supplied data

## TESTING

running `npm run test` will access the unit tests. These are code linting using standardJS and unit and http testing using Mocha and Chai

the tests can be found in /tests

## ENV VARS

can be found in the .env file in the root of this project and the following **must** be set.
```
  SQL_HOST=localhost
  SQL_USERNAME=root
  SQL_PASSWORD=root
  SQL_DATABASE=vrify-test-db
  SQL_PORT=8889
```
