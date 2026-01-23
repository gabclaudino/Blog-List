const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')
const blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    })
    savedUser = await user.save()

    const blogObjects = helper.initialBlogs.map(b => new Blog({ ...b, user: savedUser._id }))
    const promiseArray = blogObjects.map(b => b.save())
    await Promise.all(promiseArray)

    const loginRes = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'sekret' })

    authToken = loginRes.body.token
})

describe('blogs test', () => {

    test('blogs are returned as json and correct amount', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    test('blog identifier is id', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body[0].id).toBeDefined()
    })

    test('a new blog can be created', async () => {
        const newBlog = {
            title: "New blog",
            author: "Gabriel",
            url: "https://www.newblog.com",
            likes: 92
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('New blog')
    })


    test('a blog with no likes can be created', async () => {

        const newBlog = {
            title: "New Blog",
            author: "Gabriel",
            url: "https://www.newblog.com",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.at(-1).likes).toEqual(0)
    })


    test('title and url must be defined', async () => {

        const newBlog = {
            author: "Gabriel Claudino",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const contents = blogsAtEnd.map(b => b.title)

        expect(contents).not.toContain(blogToDelete.title)
    })

    test('the blogs likes can be updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToBeUpdeted = blogsAtStart[0]

        const newLikes = (blogToBeUpdeted.likes || 0) + 10

        await api
            .put(`/api/blogs/${blogToBeUpdeted.id}`)
            .send({ likes: newLikes })
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const updated = blogsAtEnd.find(b => b.id === blogToBeUpdeted.id)

        expect(updated.likes).toEqual(newLikes)
    })

    test('a blog cant be created if an invalid token is provide', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const newBlog = {
            title: "New Blog",
            author: "Gabriel",
            url: "https://www.newblog.com",
            likes: 92
        }

        const invalidToken = 'asdghsaghdasghdfsahgdsahfgdsfahgdfsaghgdsahgfdhsafgdgshafghdsagh'

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

describe('users tests', () => {

    test('fails with statuscode 400 if username is empty', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "Gabriel",
            password: "bababa"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if password is empty', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "gabizao123123",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if username is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "ga",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if password is shorter than 3 characters', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            password: "10",
            name: "Gabriel"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('fails with statuscode 400 if username not unique', async () => {

        const usersAtStart = await helper.usersInDb()
        const userSelected = usersAtStart[0]

        const newUser = {
            username: userSelected.username,
            name: "test",
            password: "test"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).toEqual(usersAtEnd.length)
    })

    test('a valid user can be created', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "test101010",
            password: "testtest",
            name: "test"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart.length).not.toEqual(usersAtEnd.length)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})