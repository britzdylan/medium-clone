const express = require('express')
// const Article = require('./../models/article')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get("/:topicslug", (req,res) => {
    res.render('topicView', { topicSlug : req.params.topicslug})
})

module.exports = router;