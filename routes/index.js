const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');


// Routes
router.get(
    '/', 
    authController.checkIfLoggedIn,
    catchErrors(ideaController.homePage)
);

// IDEAS
// -- create --
router.get('/idea/add', authController.checkIfLoggedIn, ideaController.addIdea);
router.post(
    '/idea/add',
    authController.checkIfLoggedIn,
    ideaController.upload,
    catchErrors(ideaController.resize),
    catchErrors(ideaController.createIdea)
);

router.post(
    '/idea/add/:id', 
    ideaController.upload,
    catchErrors(ideaController.resize),
    catchErrors(ideaController.updateIdea)
);

// -- read -- 
router.get('/idea/:id', catchErrors(ideaController.getIdea));

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
router.post(
    '/register', 
    ideaController.upload,
    catchErrors(ideaController.resize),
    userController.validateRegister, // validate the registration data
    catchErrors(userController.register), // register the user and save in database
    authController.login // Log the registered user in 
);

// -- logout --
router.get('/logout', authController.logout);


module.exports = router;
