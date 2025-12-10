import { render, screen } from '@testing-library/react'
import Blogform from './blogform'
import userEvent from '@testing-library/user-event'

test('<Blogform /> updates parent state and calls onSubmit', async () => {
  const blogObject = vi.fn()
  const user = userEvent.setup()

  render(<Blogform blogObject={blogObject} />)

  const input1 = screen.getByPlaceholderText('title')
  const sendButton = screen.getByText('create')
  const input2 = screen.getByPlaceholderText('author')
  const input3 = screen.getByPlaceholderText('url')

  await user.type(input1, 'First class tests')
  await user.type(input2, 'Robert C. Martin')
  await user.type(input3, 'http://example.com')
  await user.click(sendButton)

  expect(blogObject.mock.calls).toHaveLength(1)
  expect(blogObject).toHaveBeenCalledWith({
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://example.com',
  })
})
