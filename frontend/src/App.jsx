import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

  const [newName, setNewName] = useState('')

  const [newUsername, setNewUsername] = useState('')

  const [newPassword, setNewPassword] = useState('')

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

  const handleLikes = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.put(blogObject, id)
      setBlogs(blogs.map(b => b.id === id ? updatedBlog : b))
    }
    catch (exception) {
      setErrorMessage('Error updating likes')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      const deletedBlog = await blogService.deleteBlog(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      setNotificationMessage(`${blog.title} by ${blog.author} was removed`)
      setTimeout(() => setNotificationMessage(null), 5000)
    }
    catch (exception) {
      setErrorMessage('Error deleting Blog')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel1='new Blog' buttonLabel2='cancel' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      blogFormRef.current.toggleVisibility()

      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => setNotificationMessage(null), 5000)
    }
    catch (exception) {
      console.log(exception)

      const message = exception.response?.data?.error || 'Something went Worng'
      setErrorMessage(`${message}`)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleCreateAccount = async (event) => {
    event.preventDefault()

    try {
      const newUser = {
        name: newName,
        username: newUsername,
        password: newPassword,
      }

      const savedUser = await userService.create(newUser)

      setNewName('')
      setNewUsername('')
      setNewPassword('')

      setNotificationMessage(`${savedUser.name} registered!`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
    catch (exception) {
      setNewName('')
      setNewUsername('')
      setNewPassword('')

      const message = exception.response?.data?.error || 'Something went Worng'

      setErrorMessage(`${message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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

  const createAccountForm = () => (
    <form onSubmit={handleCreateAccount} className="space-y-3">
      <input
        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
        placeholder="Full Name"
        type="text"
        value={newName}
        onChange={({ target }) => setNewName(target.value)}
      />
      <input
        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
        placeholder="Username"
        type="text"
        value={newUsername}
        onChange={({ target }) => setNewUsername(target.value)}
      />
      <input
        className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500"
        placeholder="Password"
        type="password"
        value={newPassword}
        onChange={({ target }) => setNewPassword(target.value)}
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition duration-150"
      >
        Register
      </button>
    </form>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          type="password"
          value={password}
          name="Password"
          autoComplete="on"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
      >
        Sign In
      </button>
    </form>
  )
  const logout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const logoutButton = () => (
    <button
      onClick={() => logout()}
      className="px-4 py-2 bg-white text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
      logout
    </button>
  )

  if (user == null) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Notification message={notificationMessage} />
          <Error message={errorMessage} />

          <div className="bg-white p-8 rounded-xl shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back</h2>
              {loginForm()}
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Create Account</h2>
              {createAccountForm()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 text-gray-900">
      <div className="max-w-6xl mx-auto">

        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-blue-600">Blogs</span>
          </h2>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <p className="text-sm text-gray-600 italic">
              Logged in as <span className="font-semibold text-gray-800">{user.name}</span>
            </p>
            {logoutButton()}
          </div>
        </header>

        <Notification message={notificationMessage} />
        <Error message={errorMessage} />

        <section className="mb-12 flex justify-center">
          <div className="w-full max-w-xl">
            {blogForm()}
          </div>
        </section>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLikes={handleLikes}
                user={user}
                deleteBlog={deleteBlog}
              />
            ))
          }
        </main>

      </div>
    </div>
  )
}

export default App