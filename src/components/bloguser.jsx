import React from 'react'
import { Link } from 'react-router-dom'
import { Box, List, ListItem, ListItemIcon, Typography } from '@mui/material'
import FeedIcon from '@mui/icons-material/Feed'
const Bloguser = ({ user }) => {
  if (!user) {
    return <h3>User has no blogs</h3>
  }
  const blogs = user.blogs
  return (
    <Box marginY={2}>
      <Typography variant="h4">{user.name}</Typography>
      <Typography variant="h6">Added blogs</Typography>
      <List>
        {user.blogs.map((b) => (
          <ListItem key={b.id}>
            <ListItemIcon>
              <FeedIcon />
            </ListItemIcon>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
export default Bloguser
