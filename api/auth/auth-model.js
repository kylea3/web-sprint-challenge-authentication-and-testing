const db = require('../../data/dbConfig')

async function register(user) {
    await db('users')
        .insert(user)
    return db('users')
        .where('username', user.username)
    
}

module.exports = {
    register
}