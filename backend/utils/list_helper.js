const _ = require('lodash')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]



const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const likes = blogs.reduce((total, blog) => {
        return total + blog.likes
    }, 0)

    return blogs.length === 0 ? 0 : likes
}

const favoriteBlog = (blogs) => {
    let favorite = {
        title: "",
        author: "",
        likes: 0,
    }

    for (const blog of blogs) {
        if (blog.likes >= favorite.likes) {
            favorite = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    }

    return favorite
}

const mostBlogs = (blogs) => {
    const counts = _.countBy(blogs, 'author')

    const pairs = _.toPairs(counts)

    const max = _.maxBy(pairs, pair => pair[1])

    const most = {
        author: max[0],
        blogs: max[1]
    }

    return most
}

const mostLikes = (blogs) => {
    const grouped = _.groupBy(blogs, 'author')

    const authorLikes = _.map(grouped, (blogs, author) => ({
        author,
        likes: _.sumBy(blogs, 'likes')
    }))

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    listWithOneBlog,
    blogs,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}