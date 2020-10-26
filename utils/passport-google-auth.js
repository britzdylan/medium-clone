const Author = require('./../models/author')
const slugify = require('slugify')
// OAuth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_ID ,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/profile/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
  
        //passport callback function

        //check if user already exists in our db with the given profile ID
        Author.findOne({googleId: profile.id}).then((currentUser)=>{
          if(currentUser){
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else {
            let userName = slugify(profile.displayName.replace(" ", "-"), { lower: true, strict: true})
            Author.countDocuments({slug: userName}).then((currentUSer)=>{
              if(currentUSer >= 1) {
                const count = currentUSer + 1
                new Author({
                    googleId: profile.id,
                    email : profile.emails[0].value ,
                    fName : profile.name.givenName,
                    lName : profile.name.familyName,
                    username: userName + count,
                    profilePicture : profile.photos[0].value,
                  }).save().then((newUser) =>{
                    done(null, newUser)
                  })
              } else {
                new Author({
                  googleId: profile.id,
                  email : profile.emails[0].value ,
                  fName : profile.name.givenName,
                  lName : profile.name.familyName,
                  username: userName,
                  profilePicture : profile.photos[0].value,
                }).save().then((newUser) =>{
                  done(null, newUser)
                })
              }
            })
          }
      })
    }
  ));

  
  // serialize the user
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    Author.findById(id).then(user => {
      done(null, user);
    });
  });

  const checkAuthenticated = function checkAuthenticated(req, res, next) {
    if (req.user) {
      return res.redirect(`/profile/@${req.user.slug}`)
    }
  
   next()
  }
  
  const checkNotAuthenticated = function checkNotAuthenticated(req, res, next) {
    if (!req.user) {
      return res.redirect('/profile/login')
    }
    next()
  }

  const checkForSlug = async function(username) {
   const k = await Author.findOne({slug: username})
   try {
     return k
   } 
   catch(e) {
    console.log(e);
   }
  }

  module.exports = {GoogleStrategy, checkAuthenticated, checkNotAuthenticated}