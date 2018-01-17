# Notency API
Notency API is the back-end API for the [Notency project](http://github.com/CosmoRocket/Notency). For the project's complete README, please refer to [Notency README](https://github.com/CosmoRocket/Notency/blob/master/README.md)

## Setup
1. Git clone https://github.com/CosmoRocket/Notency-api.git
2. Create a .env file containing the following keys in the root folder
```
JWT_SECRET =
JWT_ALGORITHM =
JWT_EXPIRES_IN =

TWILIO_ACCOUNT_SID =
TWILIO_AUTH_TOKEN =
TWILIO_NUMBER =
TWILIO_MESSAGING_SERVICE_SID =

MAILGUN_DOMAIN =
MAILGUN_API_KEY =
MAILGUN_PUB_KEY =
```

## Test Driven Development
Notency API is built with 100% TDD coverage

1. Run syntax checker
```
yarn flow
```
2. Run test server
```
yarn test
```
3. Run tests
```
yarn jest
```

## Routes
### User

`GET /users`
- Get a list of all users

`GET /users/:id`
- Get a specific user

`POST /users`
- Create a new user
- Request Parameters: `username`, `password`

`DELETE /users/:id`
- Delete a specific user


### Auth

`POST /auth/register`
- Register as a new user
- Request Parameters: `username`, `password`

`POST /auth`
- Sign in as an existing user
- Request Parameters: `username`, `password`


### Recipient

`POST /recipients/search`
- Search for a Recipient using filters
- Request Parameters: `nationality`, `role`, `graduationDate`
```javascript
{
  "nationality": "Australia",
  "role": "Student",
  "graduationDate": "31/12/2018"
}
```