const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Author is required'
    },
    idea: {
        type: mongoose.Schema.ObjectId,
        ref: 'Idea',
        required: 'Idea is required'
    },
    text: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// this is the commentSchema -> autopopulate the author field
function autopopulate(next) {
    this.populate('author');
    next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Comment', commentSchema);
