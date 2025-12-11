const { test, describe } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const { after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

describe('when there is initially one user in db', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersInDb = async () => {
      const users = await User.find({})
      return users.map((u) => u.toJSON())
    }
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if username or password is shorter then 3 character', async () => {
    const usersInDb = async () => {
      const users = await User.find({})
      return users.map((u) => u.toJSON())
    }
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
after(async () => {
  await mongoose.connection.close()
})
