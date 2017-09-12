const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
},
    {
        timestamps: {
            'createdAt': 'createdAt',
            'updatedAt': 'updatedAt'
        }
    }
)

const Article = module.exports = mongoose.model('Idea', ideaSchema);