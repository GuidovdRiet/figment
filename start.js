const mongoose = require('mongoose');

// Import env variables from variables.env
require('dotenv').config({ path: 'variables.env'});

// Connect to db
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.log(`🚫 🚫 🚫 → ${err.message}`);
})

// Import Models
require('./models/Idea');
require('./models/User');

// Start server
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);    
})