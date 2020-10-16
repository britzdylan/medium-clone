const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/:articleSlug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.articleSlug })
    if (article == null) res.redirect('/')
    res.render('article', { article: article })
})

module.exports = router;