/* @flow */
const passport = require('passport')
const JWT = require('jsonwebtoken')
const PassportJwt = require('passport-jwt')
const User = require('../models/User')

// JWT Credentials
const jwtSecret = process.env.JWT_SECRET
const jwtAlgorithm = process.env.JWT_ALGORITHM
// const jwtExpiresIn = process.env.JWT_EXPIRES_IN

passport.use(User.createStrategy())

// $FlowFixMe - Turn off type annotations
const register = (req, res, next) => {
  const user = new User({
    username: req.body.username
  })
  // Create the user with the specified password
  User.register(user, req.body.password, (error, user) => {
    if (error) {
      // Our register middleware failed
      next(error)
      return
    }
    // Store user so we can access it in our handler
    req.user = user
    // Success!
    next()
  })
}

passport.use(
  new PassportJwt.Strategy(
    // Options
    {
      // Where will the JWT be passed in the HTTP request?
      // e.g. Authorization: Bearer xxxxxxxxxx
      jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      // What is the secret
      secretOrKey: jwtSecret,
      // What algorithm(s) were used to sign it?
      algorithms: [jwtAlgorithm]
    },
    // When we have a verified token
    (payload, done) => {
      // Find the real user from our database using the `id` in the JWT
      User.findById(payload.sub)
        .then(user => {
          // If user was found with this id
          if (user) {
            done(null, user)
          } else {
            // If not user was found
            done(null, false)
          }
        })
        .catch(error => {
          // If there was failure
          done(error, false)
        })
    }
  )
)

// $FlowFixMe - Turn off type annotations
const signJWTForUser = (req, res) => {
  // Get the user (either just signed in or signed up)
  const user = req.user
  // Create a signed token
  const token = JWT.sign(
    // payload
    {
      username: user.username
    },
    // secret
    jwtSecret,
    {
      algorithm: jwtAlgorithm,
      // expiresIn: jwtExpiresIn, // Remove Expiration
      subject: user._id.toString()
    }
  )
  // Send the token
  res.json({ token })
}

module.exports = {
  initialize: passport.initialize(),
  register,
  signIn: passport.authenticate('local', { session: false }),
  requireJWT: passport.authenticate('jwt', { session: false }),
  signJWTForUser
}
