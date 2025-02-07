const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require("../models/users")
const userService = require("../services/user.service")

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: "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",
    callbackURL: "http://localhost:3000/api/users/google/callback",
    passReqToCallback:true
  },
  async function(req, accessToken, refreshToken, profile, done) {
    const foundUser = await user.find({email:profile.emails[0].value})
    console.log("found user",foundUser)
    let res
    if(foundUser.length)
      res = await userService.loginGoogleUser(profile, foundUser)
    else
      res = await userService.registerGoogleUser(profile)
    return await done(null, res)
  }
));

passport.serializeUser((user,done) => {
    done(null,user)
})

passport.deserializeUser((user,done) => {
    done(null, user)
})