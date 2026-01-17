import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
        likes: 0
    })

    const addBlog = (event) => {
        event.preventDefault()
        createBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '', likes: 0 })
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setNewBlog({
            ...newBlog,
            [name]: value
        })
    }

    const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
    const labelStyle = "block text-sm font-semibold text-gray-700 mb-1 ml-1"

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Create a New Blog
            </h2>

            <form onSubmit={addBlog} className="space-y-5">
                <div>
                    <label className={labelStyle}>Title</label>
                    <input
                        name='title'
                        placeholder="Ex: How to study for collage tests"
                        className={inputStyle}
                        value={newBlog.title}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label className={labelStyle}>URL</label>
                    <input
                        name='url'
                        placeholder="https://example.com"
                        className={inputStyle}
                        value={newBlog.url}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelStyle}>Author</label>
                        <input
                            name='author'
                            placeholder="Author Name"
                            className={inputStyle}
                            value={newBlog.author}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className={labelStyle}>Initial Likes</label>
                        <input
                            name='likes'
                            type="number"
                            className={inputStyle}
                            value={newBlog.likes}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transform active:scale-95 transition-all shadow-md hover:shadow-lg mt-4"
                >
                    Save Blog Post
                </button>
            </form>
        </div>
    )
}

export default BlogForm