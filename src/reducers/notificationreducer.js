import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    },
  },
})
export const { setNotification, clearNotification } = notificationSlice.actions
export const setNotificationWithTimeout = (message, timeout, severity) => {
  return (dispatch) => {
    const notification = {
      message: message,
      severity: severity,
    }
    dispatch(setNotification(notification))
    clearTimeout(dispatch.clearNotification)
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}
export default notificationSlice.reducer
