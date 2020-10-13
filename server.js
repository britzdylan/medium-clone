const express = require('express');
const mongoose = require('mongoose')

// import route handlers
const indexRouter = require('./routes/index')
const articleRouter = require('./routes/article')
const authorRouter = require('./routes/author')
const profileRouter = require('./routes/profile')

//load app to express
const app = express();
app.use(express.static('public'))

//set view engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))


//db connection

//routes
app.use('/', indexRouter)
app.use('/article', articleRouter)
app.use('/author', authorRouter)
app.use('/profile', profileRouter)

// setup port
app.listen(5000); 