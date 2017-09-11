const mongoose = require('mongoose');
const Idea = mongoose.model('Idea');

exports.homePage = async (req, res) => {
    const ideas = await Idea.find();
    res.render('index', {title: "Figment", ideas});    
}

exports.addIdea = (req, res) => {
    res.render('add_idea', {title: "add idea"});
}

exports.getIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    res.render('idea', {title: idea.title, idea});
}

exports.createIdea = async (req, res) => {
    const idea = await (new Idea(req.body)).save();
    res.redirect('/');
}

exports.editIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    res.render('edit_idea', {title: `Edit ${idea.title}`, idea});
}

exports.updateIdea = async (req, res) => {
    // findOneAndUpdate({what object id to search for}, what to update it with.. all the fields just filled in(req.body(object full of fields from form), {options}))
    const idea = await Idea.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // returns new idea not the old one
        runValidator: true // runs validators again to check of required feels are filled in
    }).exec(); // exec forces to run the query
    res.redirect(`/idea/${idea._id}/edit`);
}

exports.deleteIdea = async (req, res) => {
    const idea = await Idea.findOneAndRemove({ _id: req.params.id });
    res.redirect('/');
}