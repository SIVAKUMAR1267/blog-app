const { test, beforeEach, after } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const assert = require('node:assert')
const app = require('../app')
const Blogs = require('../models/blogs')
const api = supertest(app)
let token

const initialblogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
]

beforeEach(async () => {
  await Blogs.deleteMany({})
  await Blogs.insertMany(initialblogs)
  await mongoose.connection.collection('users').deleteMany({})

  const testUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpassword',
  }
  await api.post('/api/users').send(testUser)

  // Login and get token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: testUser.username, password: testUser.password })
  token = loginResponse.body.token
})

test('a valid blog can be added ', async () => {
  const newblogs = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newblogs)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map((r) => r.title)
  assert.strictEqual(response.body.length, initialblogs.length + 1)
  assert(titles.includes('Type wars'))
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newblogs = {
    title: 'Unauthorized blog',
    author: 'No Token',
    url: 'http://notoken.com/',
    likes: 1,
  }

  await api.post('/api/blogs').send(newblogs).expect(401)
})

after(async () => {
  await mongoose.connection.collection('users').deleteMany({})
  await mongoose.connection.close()
})
