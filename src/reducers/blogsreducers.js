import { createSlice } from '@reduxjs/toolkit'
import blogs from '../services/blogs'
import { setNotificationWithTimeout } from './notificationreducer'
import { initializeusers } from './usersreducers'

const blogslice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendblog(state, action) {
      state.push(action.payload)
    },
    setblogs: (state, action) => {
      return action.payload
    },
    updateblog(state, action) {
      const updatedblog = action.payload
      return state.map((blog) =>
        blog.id !== updatedblog.id ? blog : updatedblog
      )
    },
    removeblog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const initialblogs = () => {
  return async (dispatch) => {
    const blog = await blogs.getAll()
    blog.sort((a, b) => b.likes - a.likes)
    dispatch(setblogs(blog))
  }
}
export const createblog = (content) => {
  return async (dispatch) => {
    try {
      const newblog = await blogs.create(content)
      dispatch(appendblog(newblog))
      dispatch(initialblogs())
      dispatch(
        setNotificationWithTimeout(
          `A new blog '${newblog.title}' by ${newblog.author} added`,
          5,
          'success'
        )
      )
      dispatch(initializeusers())
    } catch (error) {
      dispatch(
        setNotificationWithTimeout(
          error.response?.data?.error || 'Error creating blog',
          5,
          'error'
        )
      )
    }
  }
}
export const likeblog = (id, blog) => {
  return async (dispatch) => {
    try {
      const updatedblog = await blogs.update(id, blog)
      dispatch(blogslice.actions.updateblog(updatedblog))
      dispatch(initialblogs())
      dispatch(initializeusers())
      dispatch(
        setNotificationWithTimeout(
          `You liked '${blog.title}' by ${blog.author}`,
          5,
          'success'
        )
      )
    } catch (error) {
      setNotificationWithTimeout(
        error.response?.data?.error || 'Error liking blog',
        5,
        'error'
      )
    }
  }
}
export const deleteblog = (id) => {
  return async (dispatch) => {
    try {
      await blogs.deleteBlog(id)
      dispatch(blogslice.actions.removeblog(id))
      dispatch(initialblogs())
      dispatch(
        setNotificationWithTimeout('Blog deleted successfully', 5, 'success')
      )
      dispatch(initializeusers())
    } catch (error) {
      dispatch(
        setNotificationWithTimeout(
          error.response?.data?.error || 'Error deleting blog',
          5,
          'error'
        )
      )
    }
  }
}
export const addcomment = (id, blog) => {
  return async (dispatch) => {
    try {
      const updatedblog = await blogs.update(id, blog)
      dispatch(blogslice.actions.updateblog(updatedblog))
      dispatch(initialblogs())
      dispatch(initializeusers())
      dispatch(
        setNotificationWithTimeout(
          `You Commented on '${blog.title}' by ${blog.author}`,
          5,
          'success'
        )
      )
    } catch (error) {
      setNotificationWithTimeout(
        error.response?.data?.error || 'Error Commenting on blog',
        5,
        'error'
      )
    }
  }
}

export const { appendblog, setblogs } = blogslice.actions

export default blogslice.reducer
