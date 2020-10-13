const express = require('express')
// const Article = require('./../models/article')
const router = express.Router()

router.get('/:authorSlug', (req, res) => {
    res.render('authorView')
})

module.exports = router;