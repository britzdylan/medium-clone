const express = require('express')
const Article = require('./../models/article')
const Topic = require("./../models/topic")
const router = express.Router()

router.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    const topics = await Topic.find().sort({ topic: 'asc' })
    res.render('index', { articles: articles, topics : topics })
})

router.get("/:topicslug", async (req,res) => {
    const topics = await Topic.find().sort({ topic: 'asc' })
    const articles = await Article.find({ topics: req.params.topicslug })
    res.render('topicView', { topicSlug : req.params.topicslug.charAt(0).toUpperCase() + req.params.topicslug.slice(1).replace("-", " "), articles: articles, topics: topics })
})

module.exports = router;