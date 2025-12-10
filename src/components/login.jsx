import React, { useRef } from 'react'
import Togglable from './togglable'
import LoginForm from './loginform'
import { useDispatch, useSelector } from 'react-redux'
import { logoutuser } from '../reducers/userreducer'
import BlogForm from './blogform'

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users)
  const blogsFormRef = useRef()

  const handleLogout = () => {
    dispatch(logoutuser())
  }

  return (
    <div>
      {user === null ? (
        <Togglable
          buttonLabel="login"
          buttonlabel="cancel"
          defaultVisible={true}
        >
          <LoginForm />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged-in{' '}
            <button className="button" onClick={handleLogout}>
              logout
            </button>{' '}
          </p>
          <h2>create new</h2>

          <Togglable
            buttonLabel="New Blog"
            buttonlabel="cancel"
            ref={blogsFormRef}
          >
            <BlogForm user={user} />
          </Togglable>
        </div>
      )}
    </div>
  )
}

export default Login
