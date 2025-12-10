import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { likeblog, deleteblog, addcomment } from '../reducers/blogsreducers'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  TextField,
  Typography,
} from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'

const Blog = ({ blog }) => {
  const username = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const Navigate = useNavigate()
  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    dispatch(likeblog(blog.id, updatedBlog))
  }
  const handledelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      dispatch(deleteblog(id))
      Navigate('/')
    }
  }
  const addcomments = async (event, blog) => {
    event.preventDefault()
    const comments = event.target.comments.value
    event.target.comments.value = ''
    const updatedBlog = {
      ...blog,
      comments: [...blog.comments, comments],
    }
    dispatch(addcomment(blog.id, updatedBlog))
  }

  return (
    <Box display={'flex'} flexDirection={'column'} marginY={2}>
      <Typography variant="h4">{blog.title}</Typography>
      <Box marginY={2}>
        <Typography fontSize={16}>
          <a href={blog.url}>{blog.url}</a>
        </Typography>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Typography fontSize={16}>{blog.likes} likes</Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleLike(blog)}
          >
            like
          </Button>
        </Box>
        <Typography fontSize={16}>added by {blog.author}</Typography>
        {username?.username === blog.user.username ? (
          <Button
            size="small"
            variant="contained"
            onClick={() => handledelete(blog.id)}
          >
            Delete
          </Button>
        ) : null}
      </Box>
      <form onSubmit={(event) => addcomments(event, blog)}>
        <Box display={'flex'} alignContent={'center'} gap={2}>
          <TextField
            label="comment..."
            variant="outlined"
            size="small"
            name="comments"
            type="text"
          />
          <Button size="small" variant="contained" type="submit">
            add comment
          </Button>
        </Box>
      </form>
      <List>
        {blog.comments.map((c) => (
          <ListItem key={c}>
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>{' '}
            {c}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Blog
