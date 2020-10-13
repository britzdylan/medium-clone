const express = require('express')
// const Article = require('./../models/article')
const router = express.Router()

router.get('/id/:id', (req, res) => { 
    res.render('profile')
})

router.post('/new/article', (req, res) => { })

router.put('/edit/:articleId', (req, res) => { })

router.delete('/delete/:articleId', (req, res) => { })

router.post('/login', (req, res) => { })

router.post('/logout', (req, res) => { })

router.get('/register', (req, res) => { 
    res.render('signup')
})

router.get('/login', (req, res) => { 
    res.render('signin')
})

router.post('/register/:id', (req, res) => { 
    
 })

router.delete('/delete/profile/:profielId', (req, res) => { })

module.exports = router;