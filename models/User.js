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
    about: {
        type: String,
        required: 'Please tell something about yourself'
    },
    photo: String
});

// Passport-Local Mongoose will add a username, hash and salt field to store 
// the username, the hashed password and the salt value.
// usernameField = Email to login 
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// Make errors pretty when value is not unique 
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
