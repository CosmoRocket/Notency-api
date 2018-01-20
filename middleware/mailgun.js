/* @flow */
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const fs = require('fs')
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY

/*
*   Mailgun Auth
*/
const auth = {
  auth: {
    api_key: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN
  }
}

/*
*   Send e-mail using Node Mailer
*/
// $FlowFixMe - Turn off type annotations
const sendEmail = (to, subject, text, html, attachment) => (
  // $FlowFixMe - Turn off type annotations
  new Promise((success, fail) => {
    const nodemailerMailgun = nodemailer.createTransport(mg(auth))
    nodemailerMailgun.sendMail(
      {
        // $FlowFixMe - MAILGUN_DOMAIN is an env variable
        from: `Notency App <mailgun@${MAILGUN_DOMAIN}>`,
        to,
        subject,
        html,
        text,
        attachments: !!attachment && [
          {
            filename: !!attachment && `files/${attachment.filename}`,
            content:
              !!attachment && fs.readFileSync(`files/${attachment.filename}`)
          }
        ]
      },
      function (err, info) {
        if (err) {
          fail(err)
        } else {
          success(info)
        }
      }
    )
  })
)

module.exports = {
  sendEmail
}
