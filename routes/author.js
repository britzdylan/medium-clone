const express = require('express')
const Article = require('./../models/article')
const Author = require('./../models/author')
const router = express.Router()

router.get('/:authorSlug', async (req, res) => {
    const author = await Author.findOne({ slug : req.params.authorSlug})

    const articles = await Article.find({ author : author._id })
    res.render('authorView', { author: author, articles: articles, user : req.user})
})

module.exports = router;