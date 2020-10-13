const express = require('express')
// const Article = require('./../models/article')
const router = express.Router()

router.get('/:articleSlug', (req, res) => {
    res.render('article')
})

module.exports = router;