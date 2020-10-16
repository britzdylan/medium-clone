const express = require('express')
const Article = require('./../models/article')
const Topic = require('./../models/topic')
const router = express.Router()

//multer for file uploads
const fs = require('fs'); 
const path = require('path'); 
const multer = require('multer'); 

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 
//init upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2500000
  },
  fileFilter: function(req,file,cb) {
    checkFileType(file, cb)
  }
}).single('cover');


//function check file type

function checkFileType(file, cb) {

  //allowed ext
const fileTypes = /jpeg|jpg/;
//check ext
const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

//check mimetype
const mimetype = fileTypes.test(file.mimetype);

if(mimetype && extname){
  return cb(null, true);
} else {
  cb('error: file type not supported, jpg or jpeg only')
}
}




// create a new article
router.post('/new-article/create', async (req, res, next) => {  
  const topics = await Topic.find().sort({ topic: 'asc' })
  upload( req, res, (err) => {
    if(err) {

      res.render('newArticle', {article: new Article(), error: "", imageErr: err, topics : topics }) //pass error message
    } else {
      req.article = new Article() //pass in article model
      
      //const fileName = req.file.filename
    }
    next()
  })
},saveArticleAndRedirect())// call function to save and redirect

// get view to create a new article, pass article model
router.get('/new-article', async (req, res) => { 
    //get all topics
    const topics = await Topic.find().sort({ topic: 'asc' })
    res.render('newArticle', { article: new Article(), error: "", imageErr: null, topics : topics  })
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


function saveArticleAndRedirect() { //save new article and redirect or show an error message
    return async (req, res) => { //get all data from the body
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      article.topics = req.body.topics
      article.cover = req.file.filename

     

      try {
        article = await article.save()
        res.redirect(`/article/${article.slug}`) //redirect to the new article
      } catch (e) {
          console.log(e)
        res.render('newArticle', {article: article, error: e.code, imageErr: null, topics : topics }) //pass error message
      }
    }
  }

module.exports = router;