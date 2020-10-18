const express = require('express')
const Article = require('./../models/article')
const Topic = require('./../models/topic')
const Author = require('./../models/author')
const passport = require("passport");
const {GoogleStrategy, checkAuthenticated, checkNotAuthenticated} = require('./../utils/passport-google-auth')

const router = express.Router()

//multer for file uploads
const path = require('path'); 
const multer = require('multer'); 

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname)) //name of each uplaod
  }
})


//init upload
const upload = multer({
  storage: storage, // call storage variable
  limits: {
    fileSize: 2500000 // max size 2.5mb
  },
  fileFilter: function(req,file,cb) {
    checkFileType(file, cb) // all the check file function
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




/* 

Route: create a new article

1. fetch all topics
2. call the upload function to uplaod the image to our storage and check if the image passes the crit
3. render the new article page if theres an error with the image and pass the error to the view
4. if the image uplaod success we create a new article by using the next() function to call the **saveArticleAndRedirect** function


*/
router.post('/new-article/create', async (req, res, next) => {  

  const topics = await Topic.find().sort({ topic: 'asc' }) // fetch all topics, sort by name

  upload( req, res, (err) => {
    if(err) {

      res.render('newArticle', {article: new Article(), error: "", imageErr: err, topics : topics }) //pass error message
    } else {
      req.article = new Article() //pass in article model

    }
    next()
  })
},saveArticleAndRedirect())// call function to save and redirect

//  ============================================================


/*

get view to create a new article, pass article model
1. fetch all articles first and sort them by name
2. return the view to create articles
3. params: {
    the article model,
    errorHandling creating a new article,
    errorHandling for handling the image upload,
    all the topics
}

*/
router.get('/new-article', checkNotAuthenticated, async (req, res) => { 
    //get all topics
    const topics = await Topic.find().sort({ topic: 'asc' })
    res.render('newArticle', { article: new Article(), error: "", imageErr: null, topics : topics  })
})

// ==============================================

router.put('/edit/:articleId', (req, res) => { })

router.delete('/delete/:articleId', (req, res) => { })

router.post('/login', (req, res) => { })

router.post('/logout', (req, res) => { })

/*

Get the signin page 

*/
router.get('/login', async (req, res) => { 
  res.render('signin')
})

// ================

/*

Get the access token for google oAuth

*/
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/auth/google/redirect", passport.authenticate('google'),(req,res)=>{
  res.send(req.user);
  res.send("you reached the redirect URI");
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

// ================



router.post('/register/:id', (req, res) => { 
    
 })

router.delete('/delete/profile/:profielId', (req, res) => { })


/*
@Function: saveArticleAndRedirect

save new article and redirect or show an error message
1. 
2.
3.
4.
5.

*/


function saveArticleAndRedirect(author) { 

    return async (req, res) => { //get all data from the body

      const author = await Author.findById({ _id: "5f8b017019e2fb12f4855b0d"})

      let article = req.article // get the article form the request body
      article.title = req.body.title 
      article.description = req.body.description
      article.markdown = req.body.markdown
      article.topics = req.body.topics
      article.cover = req.file.filename
      article.author = "5f8b017019e2fb12f4855b0d"

     

      try {
        article = await article.save() //try and save the article
        author = await author.articles.push() 
        res.redirect(`/article/${article.slug}`) //redirect to the new article
      } catch (e) {
        console.log(e) // log the error
        res.render('newArticle', {article: article, error: e.code, imageErr: null, topics : topics }) //pass error messages and render the same pages
      }
    }
  }
// ===================================================

module.exports = router;