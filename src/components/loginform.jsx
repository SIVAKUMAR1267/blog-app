import React from 'react'
import { loginuser } from '../reducers/userreducer'
import { useDispatch } from 'react-redux'
import TextField from '@mui/material/TextField'
import { Stack, Button, Container, Typography } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { setNotificationWithTimeout } from '../reducers/notificationreducer'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.Username.value
    const password = event.target.Password.value
    try {
      await dispatch(loginuser(username, password))
      event.target.Username.value = ''
      event.target.Password.value = ''
      navigate('/')
    } catch (exception) {
      dispatch(
        setNotificationWithTimeout('wrong username or password', 5, 'error')
      )
    }
  }

  return (
    <Container>
      <h2>Login</h2>
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
          Login
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          {' '}
          Don&apos;t have an account?{' '}
        </Typography>
        <Typography component={Link} to="/signup" sx={{ textAlign: 'center' }}>
          Create one
        </Typography>
      </Stack>
    </Container>
  )
}

export default LoginForm
