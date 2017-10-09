const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');
const User = mongoose.model('User');

exports.confirmUser = async (req, res, next) => {
    const idea = await Idea.findOne({
        _id: req.params.id
    });

    if (idea.author.equals(req.user._id)) return next();

    req.flash('error', 'You are not allowed to access this page!');
    return res.redirect('back');
};

exports.confirmAdmin = async (req, res, next) => {
    const admin = 10;
    if (req.user.level === admin) return next();

    req.flash('error', 'You need to be an admin to enter this page!');
    return res.redirect('back');
};

exports.checkIfCurrentUser = async (req, res, next) => {
    if (!req.user._id.equals(req.params.id)) return next();

    req.flash('error', "You can't delete your own profile");
    return res.redirect('back');
};

exports.isCurrentUser = async (req, res, next) => {
    let isCurrentUser = false;
    const user = await User.findOne({ _id: req.user._id });
    if (req.user._id.equals(user._id)) {
        isCurrentUser = !isCurrentUser;
    }
    req.isCurrentUser = isCurrentUser;
    next();
};
