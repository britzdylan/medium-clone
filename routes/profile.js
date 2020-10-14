const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/:slug', (req, res) => { 
    res.render('profile')
})


// create a new article
router.post('/new/article', async (req, res, next) => {  
    req.article = new Article() //pass in article model
    next()
  }, saveArticleAndRedirect('new')) // call function to save and redirect

// get view to create a new article, pass article model
router.get('/new', (req, res) => { 
    res.render('newArticle', { article: new Article(), error: ""  })
})

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


function saveArticleAndRedirect(path) { //save new article and redirect or show an error message
    return async (req, res) => { //get all data from the body
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      article.topics = req.body.topics
      try {
        article = await article.save()
        res.redirect(`/article/${article.slug}`) //redirect to the new article
      } catch (e) {
          //console.log(e.code)
        res.render('newArticle', {article: article, error: e.code}) //pass error message
      }
    }
  }

module.exports = router;