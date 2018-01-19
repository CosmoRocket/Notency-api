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

MONGO_URI = 
MONGO_TEST_URI = 
```

## Test Pipeline
Notency API is built with 100% Test Driven Development coverage

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
  "graduationDate": "31/12/2018",
  "active": true
}
```

`GET /recipients/active`
- Get a list of all active recipients

`GET /recipients`
- Get a list of all recipients

`GET /recipients`
- Get a specific recipient

`POST /recipients`
- Create a new recipient
- Request Parameters: `idNo`, `firstName`, `lastName`, `role`, `mobile`, `email`, `nationality`, `graduationDate`

`PATCH /recipients/:id`
- Update a recipient
- Request Parameters: `idNo`, `firstName`, `lastName`, `role`, `mobile`, `email`, `nationality`, `graduationDate`

`DELETE /recipients/:id`
- Delete a specific recipient


### Notification

`GET /notifications/latest/:limit`
- Get a number of latest notifications
- Request Parameter: `limit`
```javascript
/notifications/latest/5
```

`GET /notifications`
- Get a list of all notifications

`GET /notifications`
- Get a specific notification

`POST /notifications`
- Create a new notification
- Request Parameters: `code`, `subject`, `body`, `bodyHtml`, `groups`, `recipients`, `responses`, `createdAt`

`PATCH /notifications/:id`
- Update a notification
- Request Parameters: `code`, `subject`, `body`, `bodyHtml`, `groups`, `recipients`, `responses`, `createdAt`

`DELETE /notifications/:id`
- Delete a specific notification



### Announcement

`GET /announcements/latest/:limit`
- Get a number of latest announcements
- Request Parameter: `limit`
```javascript
/announcements/latest/5
```

`GET /announcements`
- Get a list of all announcements

`GET /announcements`
- Get a specific announcement

`POST /announcements`
- Create a new announcement
- Request Parameters: `subject`, `bodyHtml`, `groups`, `recipients`, `createdAt`

`PATCH /announcements/:id`
- Update a announcement
- Request Parameters: `subject`, `bodyHtml`, `groups`, `recipients`, `createdAt``responses`, `createdAt`

`DELETE /announcements/:id`
- Delete a specific announcement



### Message

`GET /messages`
- Get a list of all messages

`GET /messages`
- Get a specific message

`POST /messages`
- Create a new message
- Request Parameters: `sender`, `body`, `createdAt`

`PATCH /messages/:id`
- Update a message
- Request Parameters: `sender`, `body`, `createdAt`

`DELETE /messages/:id`
- Delete a specific message



### SMS

`POST /sms/receive`
- Receive SMS messages and store them in the Notification responses
- Request Parameters: `From`, `Body`
```javascript
{
  From: '+61444888000',
  Body: 'EQ1 OK'
}
```

`POST /sms/send`
- Send SMS messages to a single mobile number
- Request Parameters: `recipient`, `message`
```javascript
{
  recipient: '+61444555555',
  message: 'This is a test notification!'
}
```

`POST /sms/groupSend`
- Send SMS messages to multiple mobile numbers
- Request Parameters: `recipients`, `message`
```javascript
{
  recipients: ['+61444555555', '+61444555552', '+61444555553'],
  message: 'This is a test notification!'
}
```

### E-mail

`POST /email/receive`
- Receive E-mail messages and store them in the Notification responses
- Request Parameters: `sender`, `subject`, `stripped-text`
```javascript
{
  sender: 'somone@example.com',
  subject: 'Re: Hello',
  'stripped-text': 'EQ1 OK'
}
```

`POST /email/send`
- Send E-mail messages to a single or several e-mail addresses
- Request Parameters: `recipients`, `subject`, `text`, `html`
```javascript
{
  recipients: ["someone@example.com"],
  subject: "Hello",
  text: "Testing some Mailgun awesomness!",
  html: "<h1>Testing some Mailgun awesomness!</h1>"
}
```

### File Upload
`POST /upload`
- Upload a CSV file and store data as Recipients
- Request Parameters: `file`