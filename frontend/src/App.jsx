import { useState, useEffect, use } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import login from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0
  })

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({
      ...newBlog,
      [name]: value
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setNotificationMessage(`${user.name} logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          autoComplete="on"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" className='login-button'>login</button>
    </form>
  )

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const logoutButton = () => (
    <button
      onClick={() => logout()}
      className='logout-button'>
      logout
    </button>
  )

  const addBlog = (event) => {
    event.preventDefault()

    blogService
      .create(newBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({ title: '', author: '', url: '', likes: 0 })
        setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => setNotificationMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage('Failed to create blog')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          name='title'
          value={newBlog.title}
          onChange={handleBlogChange}
        />

      </div>

      <div>
        url:
        <input
          name='url'
          value={newBlog.url}
          onChange={handleBlogChange}
        />
      </div>

      <div>
        author:
        <input
          name='author'
          value={newBlog.author}
          onChange={handleBlogChange}
        />
      </div>

      <div>
        likes:
        <input
          name='likes'
          value={newBlog.likes}
          onChange={handleBlogChange}
        />
      </div>

      <button type="submit">save</button>
    </form>
  )

  if (user == null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Error message={errorMessage} />

        {loginForm()}

      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      {logoutButton()}
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App