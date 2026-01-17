const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog
        .findById(request.params.id)
        .populate('user', { username: 1, name: 1 })

    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'Title and URL are needed' })
    }

    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author || "anonymous",
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()

    await savedBlog.populate('user', { username: 1, name: 1 })

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'Token missing or user not found' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    if (user.id.toString() === blog.user.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }
    else
        return response.status(400).json({ error: 'The blog does not belongs to you' })

})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        user: body.user,
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
        .populate('user', { username: 1, name: 1 })
    if (updatedBlog)
        response.status(200).json(updatedBlog.toJSON())
    else
        response.status(404).end()
})



module.exports = blogsRouter