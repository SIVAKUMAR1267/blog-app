import { createSlice } from '@reduxjs/toolkit'
import login from '../services/login'
import { setNotificationWithTimeout } from './notificationreducer'
import blogs from '../services/blogs'

const userslice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setuser(state, action) {
      return action.payload
    },
    clearuser() {
      return null
    },
  },
})

export const loginuser = (username, password) => {
  return async (dispatch) => {
    const user = await login.login({
      username,
      password,
    })
    dispatch(setuser(user))
    blogs.setToken(user.token)
    window.localStorage.setItem('loggedblogappUser', JSON.stringify(user))
  }
}

export const setuserfromlocalstorage = (user) => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedblogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setuser(user))
      blogs.setToken(user.token)
    }
  }
}

export const logoutuser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedblogappUser')
    dispatch(clearuser())
    dispatch(setNotificationWithTimeout('Logged out successfully', 5))
  }
}

export const { setuser, clearuser } = userslice.actions

export default userslice.reducer
