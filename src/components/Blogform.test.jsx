import { render, screen } from '@testing-library/react'
import Blogform from './blogform'
import userEvent from '@testing-library/user-event'
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

test('<Blogform /> renders form fields and create button', () => {
  renderWithProviders(<Blogform />)

  expect(screen.getByLabelText('Title')).toBeInTheDocument()
  expect(screen.getByLabelText('Author')).toBeInTheDocument()
  expect(screen.getByLabelText('Url')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
})
