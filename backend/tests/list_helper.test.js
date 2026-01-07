const listHelper = require('../utils/list_helper')

const listWithOneBlog = listHelper.listWithOneBlog
const blogs = listHelper.blogs

describe('dummy', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('list of blogs', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('list of null blogs', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })
})

describe('favorite', () => {
    test('favorite blog', () => {
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            }
        )
    })

    test('author with most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(
            {
                author: "Robert C. Martin",
                blogs: 3
            }
        )
    })

    test('author with most likes', () => {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(
            {
                author: "Edsger W. Dijkstra",
                likes: 17
            }
        )
    })
})
