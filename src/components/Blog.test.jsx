import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 25,
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }

  const { container } = render(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
      username={{ username: 'siva' }}
    />
  )
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('First class tests - Robert C. Martin')
  expect(div).not.toHaveTextContent(
    'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
  )
  expect(div).not.toHaveTextContent('Likes 25')
})
test('clicking the view button toggles visibility', async () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 25,
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }

  render(
    <Blog
      blog={blog}
      handleLike={vi.fn()}
      handleDelete={vi.fn()}
      username={{ username: 'siva' }}
    />
  )

  const user = userEvent.setup()

  expect(screen.getByText(`Likes ${blog.likes}`)).not.toBeVisible()
  expect(screen.queryByRole('link', { name: blog.url })).not.toBeInTheDocument()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByRole('link', { name: blog.url })).toBeInTheDocument()
  expect(screen.queryByText(`Likes ${blog.likes}`)).toBeVisible()

  const hideButton = screen.getByText('hide')
  await user.click(hideButton)

  expect(screen.queryByRole('link', { name: blog.url })).not.toBeInTheDocument()
  expect(screen.queryByText(`Likes ${blog.likes}`)).not.toBeVisible()
})
test('clicking the like twice button calls event handler twice', async () => {
  const blog = {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://example.com',
    likes: 25,
    user: {
      username: 'siva',
      name: 'sivakumar',
      id: '686f3ded954a17789705929e',
    },
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} handleLike={mockHandler} />)
  const user = userEvent.setup()
  const button = screen.getByText('Like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
