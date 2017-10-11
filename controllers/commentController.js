const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');

exports.addComment = async (req, res) => {
    req.body.author = req.user._id;
    req.body.idea = req.params.id;
    const comment = new Comment(req.body);
    await comment.save();
    req.flash('success', 'Your comment is saved');
    res.redirect('back');
}
