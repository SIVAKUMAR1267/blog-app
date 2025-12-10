import React, { createContext, useContext, useReducer } from 'react'

const NotificationReucer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return ''
    default:
      return state
  }
}

const Notificationcontext = createContext()

export const NotificationProvider = (props) => {
  const [notification, notificationdispatch] = useReducer(
    NotificationReucer,
    ''
  )
  return (
    <Notificationcontext.Provider value={[notification, notificationdispatch]}>
      {props.children}
    </Notificationcontext.Provider>
  )
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(Notificationcontext)
  return notificationAndDispatch[1]
}

export default Notificationcontext
