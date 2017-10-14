const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
    req.body.author = req.user._id;
    req.body.idea = req.params.id;
    const comment = new Comment(req.body);
    await comment.save();
    req.flash('success', 'Your comment is saved');
    res.redirect('back');
};

exports.editComment = async (req, res) => {
    const comment = await Comment.findOne({ _id: req.params.id });
    res.render('edit_comment', { title: 'Edit comment', comment });
};

exports.updateComment = async (req, res) => {
    const comment = await Comment.findOneAndUpdate(
        { _id: req.params.id },
        { text: req.body.text }
    );
    req.flash('success', 'Comment has been updated');
    res.redirect(`/ideas/${comment.idea}`);
};

exports.deleteComment = async (req, res) => {
    const comment = await Comment.findOneAndRemove({ _id: req.params.id });
    req.flash('success', 'Comment has been deleted');
    res.redirect(`/ideas/${comment.idea}`);
};
