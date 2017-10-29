const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorHandlers = require('./handlers/errorHandlers');
const expressValidator = require('express-validator');
const helmet = require('helmet');

require('./handlers/passport');

// Init app
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator Middleware
app.use(expressValidator());

// // OWASP
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 7776000000 }));
app.use(helmet.frameguard('SAMEORIGIN'));
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(helmet.noSniff());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Express Session Middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Use flash for flash messaging
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.helpers = require('./helpers');
    res.locals.tagOptions = [
        'Art',
        'Culture',
        'Film',
        'Food',
        'Humor',
        'Music',
        'Photography',
        'Social media',
        'Sports',
        'Business',
        'Data science',
        'Digital design',
        'Programming',
        'Health',
        'Travel'
    ];
    res.locals.user = req.user || null;
    next();
});

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle the routes
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
    /* Development Error Handler - Prints stack trace */
    app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
