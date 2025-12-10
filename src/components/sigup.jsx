import React from 'react'
import { signup } from '../reducers/usersreducers'
import { useDispatch } from 'react-redux'
import TextField from '@mui/material/TextField'
import { Stack, Button, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { setNotificationWithTimeout } from '../reducers/notificationreducer'

const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.Username.value
    const name = event.target.Name.value
    const password = event.target.Password.value
    try {
      await dispatch(signup(name, username, password))
      event.target.Username.value = ''
      event.target.Password.value = ''
      event.target.Name.value = ''
      dispatch(setNotificationWithTimeout('Signup is Successful', 5, 'success'))
      navigate('/login')
    } catch (error) {
      dispatch(
        setNotificationWithTimeout(
          error.response?.data?.error || 'Sigup Error',
          5,
          'error'
        )
      )
    }
  }

  return (
    <Container>
      <h2>Signup</h2>
      <Stack
        component="form"
        sx={{ width: '25ch' }}
        spacing={2}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="filled-hidden-label-normal"
          label="Name"
          type="name"
          name="Name"
          variant="standard"
        />

        <TextField
          id="filled-hidden-label-normal"
          label="User Name"
          type="username"
          name="Username"
          variant="standard"
        />

        <TextField
          id="standard-password-input"
          label="Password"
          type="password"
          name="Password"
          variant="standard"
        />

        <Button variant="contained" type="submit">
          Signup
        </Button>
      </Stack>
    </Container>
  )
}

export default Signup
