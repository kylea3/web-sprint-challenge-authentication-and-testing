const db = require('../data/dbConfig')
const request = require('supertest')
const server = require('./server')

const user = { username: 'Thor', password:'foobar' } 
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

describe('[POST] /api/auth/register', () => {
    test('responds with 201', async () => {
        const res = await request(server).post('/api/auth/register').send(user)
        expect(res.status).toBe(201)
    })
    test('responds with correct error code on same username', async () => {
        await request(server).post('/api/auth/register').send(user)
        const res = await request(server).post('/api/auth/register').send(user)
        expect(res.status).toBe(404)
    })
})

describe('[POST] /api/auth/login', () => {
    test('responds with 200', async () => {
      await request(server).post('/api/auth/register')
        const res = await request(server).post('/api/auth/login').send(user)
        expect(res.status).toBe(200)
    })
    test('responds with 404 if username or password missing', async () => {
      await request(server).post('/api/auth/register')
        let res = await request(server).post('/api/auth/login').send({ username: 'Thor'})
        expect(res.status).toBe(404)
        res = await request(server).post('/api/auth/login').send({ password: 'foobar'})
        expect(res.status).toBe(404)
    })
})

describe('[GET] /api/jokes', () => {
  test('token required code on no token', async () => {
    await request(server).post('/api/auth/register')
    await request(server).post('/api/auth/login').send(user)
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)  
  })
  test('responds with jokes if token valid', async () => {
    await request(server).post('/api/auth/register')
    let res = await request(server).post('/api/auth/login').send(user)
    const token = res.body.token
    res = await request(server).get('/api/jokes').set('Authorization', token)
    expect(res.status).toBe(200) 
  })
})
