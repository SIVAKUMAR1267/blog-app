import { createSlice } from '@reduxjs/toolkit'
import users from '../services/users'

const usersslice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    appendusers(state, action) {
      state.push(action.payload)
    },
    setusers(state, action) {
      return action.payload
    },
  },
})

export const { setusers, appendusers } = usersslice.actions

export const initializeusers = () => {
  return async (dispatch) => {
    const allusers = await users.getAll()
    dispatch(setusers(allusers))
  }
}
export const signup = (name, username, password) => {
  return async (dispatch) => {
    const newuser = {
      name: name,
      username: username,
      password: password,
    }
    await users.signup(newuser)
    const updateduser = dispatch(initializeusers())
    dispatch(setusers(updateduser))
  }
}

export default usersslice.reducer
