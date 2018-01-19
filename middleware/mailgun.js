const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const fs = require('fs')
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
  auth: {
    api_key: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN
  }
}

const sendEmail = (to, subject, text, html, attachment) => (
  new Promise((success, fail) => {
    const nodemailerMailgun = nodemailer.createTransport(mg(auth))
    nodemailerMailgun.sendMail(
      {
        from: `Cosmo Rocket Team <mailgun@${MAILGUN_DOMAIN}>`,
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
