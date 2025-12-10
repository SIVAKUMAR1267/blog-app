import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createblog } from '../reducers/blogsreducers'
import TextField from '@mui/material/TextField'
import { Stack, Button, Container } from '@mui/material'

const BlogForm = (user) => {
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const addblog = (event) => {
    event.preventDefault()
    dispatch(
      createblog({
        title: event.target.Title.value,
        author: event.target.Author.value,
        url: event.target.Url.value,
        user: user,
      })
    )
    event.target.Title.value = ''
    event.target.Author.value = ''
    event.target.Url.value = ''
    Navigate('/')
  }

  return (
    <div>
      <Container>
        <h2> Create New Blog </h2>
        <Stack
          component="form"
          sx={{ width: '25ch', borderTopWidth: '10ch' }}
          spacing={2}
          noValidate
          autoComplete="off"
          onSubmit={addblog}
        >
          <TextField
            id="filled-hidden-label-normal"
            label="Title"
            name="Title"
            variant="standard"
          />
          <TextField
            id="filled-hidden-label-normal"
            label="Author"
            name="Author"
            variant="standard"
          />
          <TextField
            id="filled-hidden-label-normal"
            label="Url"
            name="Url"
            variant="standard"
          />
          <Button variant="contained" type="submit">
            Create
          </Button>
        </Stack>
      </Container>
    </div>
  )
}

export default BlogForm
