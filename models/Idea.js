const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: 'You have to enter a title'
        },
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: 'You must supply an author'
        },
        body: {
            type: String,
            required: 'You have to enter an idea'
        },
        photo: String
    }, 
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

module.exports = mongoose.model('Idea', ideaSchema);
