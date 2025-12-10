import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialblogs } from './reducers/blogsreducers'
import BlogList from './components/bloglist'
import { setuserfromlocalstorage } from './reducers/userreducer'
import { initializeusers } from './reducers/usersreducers'
import Users from './components/users'
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import BlogForm from './components/blogform'
import Blog from './components/Blog'
import LoginForm from './components/loginform'
import { logoutuser } from './reducers/userreducer'
import Notification from './components/message'
import Bloguser from './components/bloguser'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, Button, AppBar, Toolbar } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Signup from './components/sigup'

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
  },
})

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users)
  const blogusers = useSelector((state) => state.blogusers)
  const blogs = useSelector((state) => state.blogs)
  const match = useMatch('/blogs/:id')
  const matchuser = useMatch('/users/:id')

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  useEffect(() => {
    dispatch(initialblogs())
    dispatch(setuserfromlocalstorage())
    dispatch(initializeusers())
  }, [dispatch])

  const blog = match
    ? blogs.find((b) => b.id === String(match.params.id))
    : null
  const bloguser = matchuser
    ? blogusers.find((bloguser) => bloguser.id === String(matchuser.params.id))
    : null

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Notification />
        <div>
          <div>
            <AppBar position="static">
              <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                      mr: 2,
                      display: { xs: 'none', md: 'flex' },
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    BLOGS
                  </Typography>

                  <Box
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                  >
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleOpenNavMenu}
                      color="inherit"
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElNav}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                      sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Button
                          component={Link}
                          to="/"
                          sx={{ textAlign: 'center' }}
                        >
                          Home
                        </Button>
                      </MenuItem>
                      <MenuItem onClick={handleCloseNavMenu}>
                        <Button
                          component={Link}
                          to="/users"
                          sx={{ textAlign: 'center' }}
                        >
                          Users
                        </Button>
                      </MenuItem>
                      {user ? (
                        <MenuItem onClick={handleCloseNavMenu}>
                          <Button
                            component={Link}
                            to="/create"
                            sx={{ textAlign: 'center' }}
                          >
                            CreateNew
                          </Button>
                        </MenuItem>
                      ) : null}
                    </Menu>
                  </Box>
                  <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="/"
                    sx={{
                      mr: 2,
                      display: { xs: 'flex', md: 'none' },
                      flexGrow: 1,
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    BLOG
                  </Typography>
                  <Box
                    sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
                  >
                    <Button
                      component={Link}
                      to="/"
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Home
                    </Button>
                    <Button
                      component={Link}
                      to="/users"
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      User
                    </Button>
                    {user ? (
                      <Button
                        component={Link}
                        to="/create"
                        onClick={handleCloseNavMenu}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        Create New
                      </Button>
                    ) : null}
                  </Box>
                  <Box sx={{ flexGrow: 0 }}>
                    {user ? (
                      <em>
                        <Tooltip title="User settings">
                          <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ p: 0 }}
                          >
                            <Avatar />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          sx={{ mt: '45px' }}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}
                        >
                          <MenuItem onClick={handleCloseUserMenu}>
                            <Typography
                              component={Button}
                              onClick={() => dispatch(logoutuser())}
                              sx={{ textAlign: 'center' }}
                            >
                              Logout
                            </Typography>
                          </MenuItem>
                        </Menu>{' '}
                      </em>
                    ) : (
                      <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                        sx={{ textAlign: 'center' }}
                      >
                        Login
                      </Button>
                    )}
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
          </div>
          <Routes>
            <Route path="/users/:id" element={<Bloguser user={bloguser} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<BlogList />} />
            <Route path="/blogs/:id" element={<Blog blog={blog} />} />
            <Route path="/create" element={<BlogForm />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default App
