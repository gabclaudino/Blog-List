const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "boa tarde a todos",
        author: "Gabriel C.",
        url: "www.gabizaoBRUTAL.com",
        likes: 100
    },
    {
        title: "boa noite!!!!!",
        author: "Gabriel Claudino de Souza",
        url: "www.gabizaoA-LENDA.com",
        likes: 1111
    }
]

const initialUsers = [
    {
        username: "gabizao",
        name: "Gabriel"
    },
    {
        username: "gabizaoApenas",
        name: "gabriel c."
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const createUser = async (user) => {
    const passwordHash = await bcrypt.hash(user.password, 10)

    const userObj = new User({
        username: user.username,
        name: user.name,
        passwordHash
    })
    return await userObj.save()
}

const createUserAndGetToken = async (api, user = initialUsers[0]) => {
    await User.deleteOne({ username: user.username })
    await createUser(user)

    const res = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })

    return res.body.token
}

const seedBlogsWithUser = async (userDoc) => {
    const blogObjects = initialBlogs.map(b => new Blog({ ...b, user: userDoc._id }))
    const saved = await Promise.all(blogObjects.map(b => b.save()))

    userDoc.blogs = (userDoc.blogs || []).concat(saved.map(s => s._id))
    await userDoc.save()

    return saved
}

module.exports = {
    initialBlogs,
    blogsInDb,
    initialUsers,
    usersInDb,
    createUser,
    createUserAndGetToken,
    seedBlogsWithUser
}