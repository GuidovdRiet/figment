const mongoose = require('mongoose');
const User = mongoose.model('User'); // this is possible cause I import the model at start.js
const Idea = mongoose.model('Idea'); // this is possible cause I import the model at start.js
const promisify = require('es6-promisify');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, cb) {
    // fileFilter: function(req, file, next) {}
        const isPhoto = file.mimetype.startsWith('image/'); // check if it is an image coming in
        if (isPhoto) {
            cb(null, true); // continue file uploading without errors
        } else {
            cb({ message: "That filetype isn't allowed" }, false); // don't continue the process
        }
    }
};

exports.loginForm = (req, res) => {
    if (req.user) {
        res.redirect('/');
    }
    res.render('login', {
        title: 'Login',
        authContainer: true
    });
};

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name'); // Remove script tags and special characters
    req.checkBody('name', 'You must supply a name').notEmpty();
    req.checkBody('email', 'That Email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
    // Set how to convert the users emailadress
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be blank').notEmpty();
    req
        .checkBody('password-confirm', 'Confirm Password cannot be blank!')
        .notEmpty();
    req
        .checkBody('password-confirm', 'Your passwords do not match')
        .equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', {
            title: 'Register',
            body: req.body,
            messages: req.flash()
        });
        return;
    }
    next();
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }
    // Take the filename and give a unique identifier
    const fileType = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${fileType}`;
    // Resize photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(400, jimp.AUTO);
    // Save photo to folder
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.register = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name,
        photo: req.body.photo,
        about: req.body.about
    });
    // .register comes from the model module passportLocalMongoos,
    // .register is the method that hashes the password in the db
    const registerWithPromise = promisify(User.register, User);
    await registerWithPromise(user, req.body.password);
    next(); // pass to authController.login
};

exports.editAccount = (req, res) => {
    res.render('edit_account', { title: 'Profile' });
};

exports.updateUserAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };
    await User.findOneAndUpdate(
        { _id: req.user._id }, // take the _id from the request instead of the user for safety
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );

    req.flash('success', 'Updated account');
    res.redirect('back');
};

exports.getUser = async (req, res) => {
    const userProfile = await User.findOne({ _id: req.params.id });
    const ideas = await Idea.find().populate('author', [
        'name',
        'about',
        'photo'
    ]);
    const currentUser = req.user._id.equals(userProfile.id);
    // Get ideas who belong to the specific user
    const userIdeas = ideas.filter(idea => idea.author.equals(req.params.id));
    res.render('user_profile', {
        title: `${userProfile.name}`,
        userProfile,
        userIdeas,
        currentUser,
        userCardLarge: true
    });
};

exports.followers = async (req, res) => {
    const userToFollow = await User.findOne({ _id: req.params.id });

    // following req.user +1
    const following = req.user.following.map(obj => obj.toString());
    const operatorOne = following.includes(userToFollow._id.toString())
        ? '$pull'
        : '$addToSet';
    await User.findByIdAndUpdate(
        req.user._id,
        { [operatorOne]: { following: userToFollow._id } },
        { new: true }
    );

    // followers userToFollow +1
    const followers = userToFollow.followers.map(obj => obj.toString());
    const operatorTwo = followers.includes(req.user._id.toString()) 
        ? '$pull'
        : '$addToSet';
    const currentViewedUser = await User.findByIdAndUpdate(
        userToFollow._id,
        { [operatorTwo]: { followers: req.user._id } },
        { new: true }
    );
    res.json(currentViewedUser);
};
