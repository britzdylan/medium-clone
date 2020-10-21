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
},saveArticleAndRedirect('newArticle'))// call function to save and redirect

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

    res.render('newArticle', { article: new Article(), error: "", imageErr: null, topics : topics, user : req.user  })
})

// ==============================================

router.get('/edit/:id', async (req, res) => {
  //get all topics
  const topics = await Topic.find().sort({ topic: 'asc' })
  //get the article
  const article = await Article.findById(req.params.id)

  //console.log(article);
  res.render('editArticle', { article: article, error: "", imageErr: null, topics : topics, user : req.user })
})

//save the edited article
router.put('/edit/save/:id', async (req, res, next) => {
  const topics = await Topic.find().sort({ topic: 'asc' })
  upload( req, res, (err) => {
    if(err) {

      res.render('editArticle', {article: req.article, error: "", imageErr: err, topics : topics }) //pass error message
    } else {

      req.article = Article.findById(req.params.id) //pass in article
      //req.user = Author.findById(req.user.id) //find the current user
    }
    next()
  })
}, saveArticleAndRedirect('editArticle'))




//delete the article

router.delete('/:id', async (req, res) => {

  const article = await Article.findById(req.params.id)
  await Article.findByIdAndDelete(req.params.id)
  let author = req.user
  const newArray = author.articles.filter(article => article._id != req.params.id)
  author.articles = newArray
  author = await author.save()

  res.redirect(`/profile/@${req.user.slug}`)
})
// =================

/*

Get the signin page 

*/
router.get('/login', checkAuthenticated, async (req, res) => { 
  res.render('signin', {user : req.user})
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
router.get("/:profileslug", checkNotAuthenticated, async (req,res)=>{
  const articles = await Article.find({ author : req.user._id })
  res.render("profile", { myProfile : req.user, articles: articles, user : req.user})
});


// logout the current user and 
router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect('/');
});

// ================

router.delete('/delete/profile/:profielId', (req, res) => { 

 })




/*
@Function: saveArticleAndRedirect

save new article and redirect or show an error message
1. 
2.
3.
4.
5.

*/


function saveArticleAndRedirect(redirect) { 

    return async (req, res) => { //get all data from the body

      let article = await req.article // get the article form the request body
      article.title = req.body.title != undefined ? req.body.title : article.title
      article.description = req.body.description != undefined ? req.body.description : article.description
      article.markdown = req.body.markdown != undefined ? req.body.markdown : article.markdown
      article.topics = req.body.topics != undefined ? req.body.topics : article.topics
      article.cover = req.file != undefined ? req.file.filename : article.cover
      article.author = req.user._id //asign the id of the signed in user

      try {
        article = await article.save() //try and save the article

        res.redirect(`/article/${article.slug}`) //redirect to the new article
        
      } catch (e) {
        console.log(e) // log the error
        res.render(redirect, {article: article, error: e.code, imageErr: null, topics : article.topics }) //pass error messages and render the same pages
      }
    }
  }
// ===================================================


module.exports = router;