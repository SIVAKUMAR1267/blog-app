const { test, after, beforeEach, describe } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const assert = require('node:assert')
const app = require('../app')
const Blogs = require('../models/blogs')

const api = supertest(app)
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
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test('a valid blog can be added ', async () => {
  const newblogs = {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newblogs)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)

  assert.strictEqual(response.body.length, initialblogs.length + 1)

  assert(titles.includes('Type wars'))
})

test('a specific blog can be viewed', async () => {
  const blogs = await Blogs.find({})
  const blogsAtStart = blogs.map((blog) => blog.toJSON())
  const blogToView = blogsAtStart[1]

  const resultblog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.deepStrictEqual(resultblog.body, blogToView)
})

test('a blog with a 0 likes is added with likes 0', async () => {
  const newblogs = {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    __v: 0,
  }
  await api
    .post('/api/blogs')
    .send(newblogs)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)
  const likes = response.body.map((r) => r.likes)
  assert.strictEqual(response.body.length, initialblogs.length + 1)
  assert(likes.includes(0))
  assert(titles.includes('TDD harms architecture'))
})

test('blog without any missing attribute is not added', async () => {
  const newblog = {
    link: 'https://reactpatterns.com/',
  }

  await api.post('/api/blogs').send(newblog).expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialblogs.length)
})
describe('deleting a blog', () => {
  test('a blog can be deleted', async () => {
    const blogs = await Blogs.find({})
    const blogsAtStart = blogs.map((blog) => blog.toJSON())
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const response = await api.get('/api/blogs')

    const titles = response.body.map((r) => r.title)

    assert.strictEqual(response.body.length, initialblogs.length - 1)
    assert(!titles.includes(blogToDelete.title))
  })
})
describe('updating a blog', () => {
  test('a blog can be updated', async () => {
    const blogs = await Blogs.find({})
    const blogsAtStart = blogs.map((blog) => blog.toJSON())
    const blogToUpdate = blogsAtStart[0]
    const updatedblog = {
      title: 'Updated blog',
      author: 'Updated Author',
      url: 'https://updatedurl.com/',
      likes: 10,
    }
    const resultblog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedblog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(resultblog.body.title, updatedblog.title)
    assert.strictEqual(resultblog.body.author, updatedblog.author)
    assert.strictEqual(resultblog.body.url, updatedblog.url)
    assert.strictEqual(resultblog.body.likes, updatedblog.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
