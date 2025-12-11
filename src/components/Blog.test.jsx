import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import notificationreducer from '../reducers/notificationreducer'
import blogsreducers from '../reducers/blogsreducers'
import userreducer from '../reducers/userreducer'
import usersreducers from '../reducers/usersreducers'
import { BrowserRouter as Router } from 'react-router-dom'

const createTestStore = () => {
  return configureStore({
    reducer: {
      notification: notificationreducer,
      blogs: blogsreducers,
      users: userreducer,
      blogusers: usersreducers,
    },
  })
}

const renderWithProviders = (component) => {
  const store = createTestStore()
  return render(
    <Provider store={store}>
      <Router>
        {component}
      </Router>
    </Provider>
  )
}

test('renders content', () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 25,
    comments: [],
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }

  renderWithProviders(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
      username={{ username: 'siva' }}
    />
  )
  expect(screen.getByText('First class tests')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: blog.url })).toBeInTheDocument()
})
test('clicking the view button toggles visibility', async () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 25,
    comments: [],
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }

  renderWithProviders(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
      username={{ username: 'siva' }}
    />
  )

  expect(screen.getByText('First class tests')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: blog.url })).toBeInTheDocument()
})
test('clicking the like twice button calls event handler twice', async () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 25,
    comments: [],
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }
  renderWithProviders(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByRole('button', { name: 'like' })
  await user.click(button)
  await user.click(button)
  expect(button).toBeInTheDocument()
})
