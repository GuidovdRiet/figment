const mongoose = require('mongoose');
const User = mongoose.model('User');
const Idea = mongoose.model('Idea');

exports.dashboard = async (req, res) => {
    const users = await User.find();
    res.render('adminDashboard', { title: 'Admin dashboard', users });
}

exports.getUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    res.render('user', { title: user.name, user });
}

exports.editUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id });
    const ideas = await Idea.find().populate('author', [
        'name',
        'about',
        'photo'
    ]);
    // Get ideas who belong to the specific user
    const userIdeas = ideas.filter(idea => idea.author.equals(req.params.id));
    res.render('edit_user', { title: `edit ${user.name}`, user, userIdeas });
}

exports.updateUser = async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidator: true
    }).exec();

    req.flash('success', 'Succesfully updated')
    res.redirect(`/admin/${user._id}/edit`);
}

exports.deleteUser = async (req, res) => {
    await User.findByIdAndRemove({ _id: req.params.id });
    req.flash('success', 'User is deleted');
    res.redirect('back');
}

//  API
exports.ideasVisibility = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id });
    const findIdea = await Idea.findByIdAndUpdate(
        idea._id,
        { $set: { visible: !idea.visible } },
        { new: true }
    )
    res.json(findIdea);
}
