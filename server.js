if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
const methodOverride = require('method-override')
const cookieSession = require("cookie-session")
const PORT = process.env.PORT || 5000;
// import route handlers
const indexRouter = require('./routes/index')
const articleRouter = require('./routes/article')
const authorRouter = require('./routes/author')
const profileRouter = require('./routes/profile')
const passport = require("passport");


//load app to express
const app = express();
app.use(express.static(path.join(__dirname, "public")))
 

//set view engine
app.set('view engine', 'ejs')
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

//passportjs setup
app.use(cookieSession({
  // milliseconds of a day
  maxAge: 24*60*60*1000,
  keys:[process.env.COOKIESESSION || "a56s1d612f65a16a1d6"]
}));

app.use(passport.initialize());
app.use(passport.session());


//db connection

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

//routes
app.use('/', indexRouter)
app.use('/article', articleRouter)
app.use('/author', authorRouter)
app.use('/profile', profileRouter)

// setup port
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
}); 