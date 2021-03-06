const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');
const User = mongoose.model('User');
const multer = require('multer');
const { ObjectId } = require('mongodb');
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
    // pagination
    const currentPage = req.params.page || 1;
    const limit = 4;
    const skip = currentPage * limit - limit;
    // only show ideas from following users
    const followingUsers = req.user.following;
    const objIds = followingUsers.map(followingUser => ObjectId(followingUser));
    const ideasPromise = Idea.find({ author: { $in: objIds } })
        .populate('author', ['name', 'photo', 'about'])
        .skip(skip)
        .limit(limit);

    const countPromise = Idea.find({ author: { $in: objIds } }).count();

    const [ideas, count] = await Promise.all([ideasPromise, countPromise]);

    const totalPages = Math.ceil(count / limit);

    // check if requested page exists
    if (!ideas.length && skip) {
        req.flash(
            'error',
            `Page ${currentPage} doesn't exists, ${totalPages} is the last page`
        );
        res.redirect(`/pages/${totalPages}`);
        return;
    }

    // The current user
    const currentUser = req.isCurrentUser;

    // Check how many ideas user has published
    const user = req.user._id;
    const userIdeas = await User.getTotalUserIdeas(user);

    res.render('index', {
        title: 'Figment',
        userIdeasTotal: userIdeas[0].total_user_ideas,
        // pagination
        currentPage,
        totalPages,
        count,
        // ---------
        currentUser,
        ideas
    });
};

exports.addIdea = (req, res) => {
    res.render('add_idea', {
        title: 'add idea',
        addIdeaContainer: true
    });
};

exports.getIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id })
        .populate('author', ['name', 'about'])
        .populate('comments');
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
    req.flash('success', 'Success, idea successfully created');
    res.redirect('/');
    return true;
};

exports.editIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    res.render('edit_idea', {
        title: `Edit ${idea.title}`,
        addIdeaContainer: true,
        idea
    });
};

exports.updateIdea = async (req, res) => {
    const idea = await Idea.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidator: true
    }).exec(); // exec forces to run the query

    req.flash('success', 'Success, your idea has been updated');
    res.redirect(`/idea/${idea._id}/edit`);
};

exports.deleteIdea = async (req, res) => {
    await Idea.findOne({ _id: req.params.id });
    await Idea.findOneAndRemove({ _id: req.params.id });
    req.flash('success', 'Idea deleted 🚫');
    res.redirect('/');
};

exports.popular = async (req, res) => {
    const ideas = await Idea.find().populate('author', [
        'name',
        'about',
        'photo'
    ]);
    ideas.sort((a, b) => b.hearts.length - a.hearts.length);
    res.render('popular', { title: 'Most popular ideas', ideas });
};

// API

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

exports.readingList = async (req, res) => {
    const readingList = req.user.readingList.map(obj => obj.toString());
    const operator = readingList.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { [operator]: { readingList: req.params.id } },
        { new: true }
    );
    res.json(user);
};

exports.getReadingList = async (req, res) => {
    const ideas = await Idea.find({
        _id: { $in: req.user.readingList }
    }).populate('author', ['name', 'about', 'photo']);
    res.render('readingList', {
        title: 'Reading List',
        ideas,
        isReadingList: true
    });
};

exports.heartIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    const hearts = idea.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.user._id.toString())
        ? '$pull'
        : '$addToSet';
    const findIdea = await Idea.findByIdAndUpdate(
        idea._id,
        { [operator]: { hearts: req.user._id } },
        { new: true }
    );
    res.json(findIdea);
};

exports.getHearts = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id }).populate('hearts', [
        'name',
        'photo'
    ]);
    res.render('get_idea_hearts', { title: `❤️ ${idea.title}`, idea });
};

exports.explore = async (req, res) => {
    const ideas = await Idea.find().populate('author', [
        'name',
        'photo',
        'about'
    ]);
    // check how many ideas the user has published
    const currentUser = req.isCurrentUser;
    const userIdeas = ideas.filter(idea => idea.author.equals(req.user._id));
    const ideaAmount = userIdeas.length;
    res.render('index', {
        title: 'Figment',
        userIdeasTotal: ideaAmount,
        currentUser,
        ideas
    });
};
