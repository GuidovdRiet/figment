const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// import env variables from variables.env
require('dotenv').config({ path: 'variables.env'});

// connect to db
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.log(`🚫🚫🚫 → ${err.message}`);
})

// Init app
const app = express();

// Bring in the Models
const Idea = require('./models/Idea');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    Idea.find({}, (err, ideas) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index', {title: "Figment", ideas});    
        }
    });
});

app.get('/ideas/add', (req, res) => {
    res.render('add_idea', {title: 'Add idea'})
});

// Add Submit POST Route 
app.post('/ideas/add', (req, res) => {
    const idea = new Idea();
    idea.title = req.body.title;
    idea.author = req.body.author;
    idea.body = req.body.body;
    idea.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Start server
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);    
})