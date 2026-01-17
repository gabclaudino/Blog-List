import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, updateLikes, user, deleteBlog }) => {

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleClick = () => {

    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }

    updateLikes(blog.id, updatedBlog)
  }

  const confirmDelete = () => {
    const result = window.confirm(`Remove ${blog.title} by ${blog.author}`)
    if (result)
      deleteBlog(blog)
  }

  const deleteButton = (user.username === blog.user.username)

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
          {blog.title}
        </h3>

        <button
          onClick={toggleVisibility}
          className="text-blue-600 text-sm font-semibold hover:underline mb-4"
        >
          {visible ? 'Show less ↑' : 'Show details ↓'}
        </button>

        {visible && (
          <div className="mt-4 space-y-3 pt-4 border-t border-gray-50 animate-fade-in">
            <p className="text-gray-500 text-base">
              Author: <span className="font-medium italic text-gray-700">{blog.author}</span>
            </p>

            <div className="flex items-center gap-2 text-base">
              <span className="text-gray-500 shrink-0">URL:</span>
              <a
                href={blog.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 truncate hover:text-blue-700 font-medium"
              >
                {blog.url}
              </a>
            </div>

            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl">
              <span className="text-blue-800 font-bold">👍 {blog.likes} likes</span>
              <button
                onClick={handleClick}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Like
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteButton && (
        <button
          onClick={confirmDelete}
          className="mt-6 w-full py-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Remove Blog
        </button>
      )}
    </div>
  )
}

export default Blog