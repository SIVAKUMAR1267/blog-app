import React from 'react'
import { useSelector } from 'react-redux'
import Alert from '@mui/material/Alert'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (!notification) {
    return null
  }
  return <Alert severity={notification.severity}>{notification.message}</Alert>
}
export default Notification
