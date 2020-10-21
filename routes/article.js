const express = require('express')
const Article = require('./../models/article')
const Author = require('./../models/author')
const router = express.Router()

router.get('/:articleSlug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.articleSlug })
    const author = await Author.findById({ _id: article.author })
    if (article == null) res.redirect('/')
    res.render('article', { article: article, author : author, user : req.user })
})

module.exports = router;