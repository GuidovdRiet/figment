const mongoose = require('mongoose');
const User = mongoose.model('User');

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
    res.render('edit_user', { title: `edit ${user.name}`, user });
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
