const db = require('../../data/dbConfig')

async function register(user) {
    await db('users')
        .insert(user)
    return db('users')
        .where('username', user.username)
    
}

async function checkUsername(username) {
    return await db('users')
        .where('username', username)
        .count()
}

async function findBy(username) {
    return db('users')
        .where('username', username)
}

module.exports = {
    register,
    checkUsername,
    findBy
}