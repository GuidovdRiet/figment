const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());

// pass on the User model to each request 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

