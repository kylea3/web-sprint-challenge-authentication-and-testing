const Auth = require('./auth-model')

function checkCredentials (req, res, next) {
    const { username, password } = req.body
    if (!username || !password) {
        next(res.status(404).json({ message: "username and password required" }))
    } else {
        next()
    }
}

async function checkUsername (req, res, next) {
    const { username } = req.body;
    const user = await Auth.checkUsername(username)
    if(user[0]['count(*)'] === 1) {
        next(res.status(404).json({ message: 'username taken'}))
        } else {
        next()
        }
}

async function checkUsernameLogin (req, res, next) {
    const { username } = req.body;
    const user = await Auth.checkUsername(username)
    if(user[0]['count(*)'] === 0) {
        next(res.status(404).json({ message: 'invalid credentials'}))
        } else {
        next()
        }
}

module.exports = {
    checkCredentials,
    checkUsername,
    checkUsernameLogin
}