const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please Supply an Email Address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    level: {
        type: Number,
        default: 0
    },
    about: {
        type: String,
        required: 'Please tell something about yourself'
    },
    photo: {
        type: String,
        default: 'no-avatar-selected.jpeg'
    },
    readingList: [{ type: mongoose.Schema.ObjectId, ref: 'Idea' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
});

userSchema.statics.getTotalUserIdeas = function (currentUser) {
    return this.aggregate([
        {
            $lookup: {
                from: 'ideas',
                localField: '_id',
                foreignField: 'author',
                as: 'written_ideas'
            }
        },
        {
            $project: {
                total_user_ideas: { $size: '$written_ideas' }
            }
        },
        { $match: { _id: currentUser } }
    ]);
};

// Passport-Local Mongoose will add a username, hash and salt field to store
// the username, the hashed password and the salt value.
// usernameField = Email to login
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Make errors pretty when value is not unique
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
