const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Auth = require('./auth-model')
const { checkCredentials, checkUsername } = require('./auth-middleware')
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('./secrets/index')

router.post('/register', checkCredentials, checkUsername, (req, res, next) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 8);
  credentials.password = hash
  Auth.register(credentials)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
  

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkCredentials, (req, res, next) => {
    let { username, password } = req.body;
    Auth.findBy(username)
      .then(user => {
        if(bcrypt.compareSync(password, user[0].password)) {
          const token = buildToken(user[0]);
          res.status(200).json({ message: `welcome, ${user[0].username}`, token })
      }
    })
      .catch(next)

      function buildToken(user) {
        console.log(JWT_SECRET)
        const payload = {
          subject: user.id,
          username: user.username
        }
        const options = {
          expiresIn: "1d",
        }
        return jwt.sign(payload, JWT_SECRET.JWT_SECRET , options)
      }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    sageAdvice: 'Finding the real error is 90% of the bug fix',
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;
