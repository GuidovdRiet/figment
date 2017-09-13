const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out!');
    res.redirect('/');
};

exports.checkIfLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next()
        return;
    } else {
        req.flash('error', 'Oops you need to be logged in');
        res.redirect('/login');
    }
}

