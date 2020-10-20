const express = require('express')
const Article = require('./../models/article')
const Topic = require('./../models/topic')
const Author = require('./../models/author')
const passport = require("passport");

const {GoogleStrategy , checkAuthenticated, checkNotAuthenticated} = require('./../utils/passport-google-auth')

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
      //req.user = Author.findById(req.user.id) //find the current user
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

router.delete('/:id', async (req, res) => {

  const article = await Article.findById(req.params.id)
  await Article.findByIdAndDelete(req.params.id)
  let author = req.user
  const newArray = author.articles.filter(article => article._id != req.params.id)
  author.articles = newArray
  author = await author.save()

  res.redirect(`/profile/@${req.user.slug}`)
})

/*

Get the signin page 

*/
router.get('/login', checkAuthenticated, async (req, res) => { 
  res.render('signin')
})

// ================

/*

Get the access token for google oAuth

*/
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));


// after the user logs in successfully then redirect to the profile page 
router.get("/auth/google/redirect", passport.authenticate('google'),(req,res)=>{
  res.redirect(`/profile/@${req.user.slug}`)
});

// Render the profile page with the data from the current logged in user
router.get("/:profileslug", checkNotAuthenticated,(req,res)=>{
  
  res.render("profile", { myProfile : req.user})
});


// logout the current user and 
router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

// ================

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


function saveArticleAndRedirect() { 

    return async (req, res) => { //get all data from the body

      let author = req.user
   

      let article = await req.article // get the article form the request body
      article.title = req.body.title 
      article.description = req.body.description
      article.markdown = req.body.markdown
      article.topics = req.body.topics
      article.cover = req.file.filename
      article.author = req.user._id //asign the id of the signed in user
      test = await author.articles.push(article)
      
      try {
        if(test > -1) {
        article = await article.save() //try and save the article
        author = await author.save()
       res.redirect(`/article/${article.slug}`) //redirect to the new article
        }
        //console.log(test);
      } catch (e) {
        console.log(e) // log the error
        res.render('newArticle', {article: article, error: e.code, imageErr: null, topics : topics }) //pass error messages and render the same pages
      }
    }
  }
// ===================================================

module.exports = router;