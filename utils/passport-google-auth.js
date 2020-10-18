const Author = require('./../models/author')

// OAuth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_ID || "35745402018-a68p1q7qoigl5omt9gfo1lrb26pikit7.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_SECRET || "OYlhZLo0wL7PrEM4byKA5Joa",
      callbackURL: "/profile/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
  
        //passport callback function
        //check if user already exists in our db with the given profile ID
        Author.findOne({googleId: profile.id}).then((currentUser)=>{
          if(currentUser){
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else {
            //if not, create a new user 
            new Author({
              googleId: profile.id,
              email : profile.emails[0].value ,
              fName : profile.name.givenName,
              lName : profile.name.familyName,
              username: profile.displayName.replace(" ", "-"),
              profilePicture : profile.photos[0].value,
            }).save().then((newUser) =>{
              done(null, newUser)
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
      return next()
    }
  
    res.redirect('/login')
  }
  
  const checkNotAuthenticated = function checkNotAuthenticated(req, res, next) {
    if (!req.user) {
      return res.redirect('/profile/login')
    }
    next()
  }

  module.exports = {GoogleStrategy, checkAuthenticated, checkNotAuthenticated}