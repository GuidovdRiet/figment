const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// Routes
router.get('/', catchErrors(ideaController.homePage));

// IDEAS
// -- create --
router.get('/ideas/add', authController.checkIfLoggedIn, ideaController.addIdea);
router.post('/ideas/add', catchErrors(ideaController.createIdea));
router.post('/ideas/add/:id', catchErrors(ideaController.updateIdea));

// -- read -- 
router.get('/ideas/:id', catchErrors(ideaController.getIdea));

// -- update -- 
router.get('/idea/:id/edit', catchErrors(ideaController.editIdea));

// -- delete -- 
router.get('/idea/:id/delete', catchErrors(ideaController.deleteIdea));


// USER
router.get('/account', userController.account);
router.post('/account', catchErrors(userController.updateAccount));

// -- login --
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

// -- register --
router.get('/register', userController.registerForm);
router.post('/register', 
    userController.validateRegister,    // 1. validate the registration data
    userController.register,            // 2. register the user and save in database
    authController.login                // 3. Log the registered user in 
);

// -- logout --
router.get('/logout', authController.logout);

// INSPIRATION
router.get('/inspiration', ideaController.inspiration);



module.exports = router;