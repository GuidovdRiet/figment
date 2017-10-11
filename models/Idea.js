const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: 'You have to enter a title'
        },
        author: {
            ref: 'User',
            type: mongoose.Schema.ObjectId,
            required: 'You must supply an author'
        },
        body: {
            type: String,
            required: 'You have to enter an idea'
        },
        tags: [String],
        hearts: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
        photo: String
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);

// show the virtual fields in the output on screen
ideaSchema.set('toObject', {
    virtuals: true
});

ideaSchema.set('toJSON', {
    virtuals: true
});

ideaSchema.index({
    title: 'text',
    author: 'text',
    body: 'text'
});

// create new virtual field with the name 'comments'
// find the comments where the idea _id property === comments idea property
ideaSchema.virtual('comments', {
    ref: 'Comment', // what model to link?
    localField: '_id', // which field on the store?
    foreignField: 'idea' // which field on the review?
});

module.exports = mongoose.model('Idea', ideaSchema);
