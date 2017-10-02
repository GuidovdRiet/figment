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

ideaSchema.index({
    title: 'text',
    author: 'text',
    body: 'text'
});

module.exports = mongoose.model('Idea', ideaSchema);
