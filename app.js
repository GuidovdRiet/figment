const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');

// Init app
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle the routes
app.use('/', routes)

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