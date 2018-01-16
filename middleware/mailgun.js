const mailgun = require('mailgun.js')

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const MAILGUN_PUB_KEY = process.env.MAILGUN_PUB_KEY

const mg = mailgun.client({
  username: 'api',
  key: MAILGUN_API_KEY,
  public_key: MAILGUN_PUB_KEY
})

// Send Email Message
const sendEmail = (to, subject, text, html) => {
  return mg.messages.create(MAILGUN_DOMAIN, {
    from: `Cosmo Rocket Team <mailgun@${MAILGUN_DOMAIN}>`,
    to: to, // Array of recipients
    subject: subject, // Email subject
    text: text, // Email body (text version)
    html: html // Email body (html version)
  })
}

module.exports = {
  sendEmail
}