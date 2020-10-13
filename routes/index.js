const express = require('express')
// const Article = require('./../models/article')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get("/:topicslug", (req,res) => {
    res.render('topicView', { topicSlug : req.params.topicslug.charAt(0).toUpperCase() + req.params.topicslug.slice(1).replace("-", " ") })
})

module.exports = router;