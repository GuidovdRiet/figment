const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');
const User = mongoose.model('User');
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

exports.homePage = async (req, res) => {
    const ideas = await Idea.find().populate('author', [
        'name',
        'about',
        'photo'
    ]);
    // check how many ideas the user has published
    const userIdeas = ideas.filter(idea => idea.author.equals(req.user._id));
    const ideaAmount = userIdeas.length;
    res.render('index', { title: 'Figment', userIdeasTotal: ideaAmount, ideas });
};

exports.addIdea = (req, res) => {
    res.render('add_idea', { title: 'add idea' });
};

exports.getIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id }).populate('author', [
        'name',
        'about'
    ]);
    res.render('idea', { title: idea.title, idea });
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

exports.createIdea = async (req, res) => {
    req.body.author = req.user._id;
    await new Idea(req.body).save();
    req.flash('success', 'Article Created!');
    res.redirect('/');
    return true;
};

exports.editIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    res.render('edit_idea', { title: `Edit ${idea.title}`, idea });
};

exports.updateIdea = async (req, res) => {
    const idea = await Idea.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidator: true
    }).exec(); // exec forces to run the query

    req.flash('success', 'Idea Updated');
    res.redirect(`/idea/${idea._id}/edit`);
};

exports.deleteIdea = async (req, res) => {
    await Idea.findOne({ _id: req.params.id });
    await Idea.findOneAndRemove({ _id: req.params.id });
    req.flash('success', 'Idea deleted');
    res.redirect('/');
};

exports.searchIdeas = async (req, res) => {
    // First find ideas that match te query params
    const ideas = await Idea.find(
        {
            $text: {
                $search: req.query.q
            }
        },
        {
            score: { $meta: 'textScore' }
        }
    )
    // Sort the stores on score from highest to lowest
        .sort({
            score: { $meta: 'textScore' }
        })
        // Limit to 5 search results
        .limit(5);
    res.json(ideas);
};

exports.likeIdea = async (req, res) => {
    const likes = req.user.likes.map(obj => obj.toString());
    const operator = likes.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { [operator]: { likes: req.params.id } },
        { new: true }
    );
    res.json(user);
};
