const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const userMiddleware = require('../middleware/userMiddleware');
const { catchErrors } = require('../handlers/errorHandlers');

// INDEX
router.get(
    '/',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.homePage)
);

// IDEAS
// -- create --
router.get(
    '/ideas/add',
    authController.checkIfLoggedIn,
    ideaController.addIdea
);

router.post(
    '/ideas/add',
    authController.checkIfLoggedIn,
    ideaController.upload,
    catchErrors(ideaController.resize),
    catchErrors(ideaController.createIdea)
);

router.post(
    '/ideas/add/:id',
    userMiddleware.confirmUser,
    ideaController.upload,
    catchErrors(ideaController.resize),
    catchErrors(ideaController.updateIdea)
);

// -- read --
router.get('/ideas/:id', catchErrors(ideaController.getIdea));

// -- update --
router.get(
    '/idea/:id/edit',
    userMiddleware.confirmUser,
    catchErrors(ideaController.editIdea)
);

// -- delete --
router.get(
    '/idea/:id/delete',
    userMiddleware.confirmUser,
    catchErrors(ideaController.deleteIdea)
);

// READINGLIST
// -- read --
router.get(
    '/readinglist',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.getReadingList)
);

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

// ADMIN
// -- dashboard --
router.get(
    '/admin',
    userMiddleware.confirmAdmin,
    catchErrors(adminController.dashboard)
);

// read
router.get('/admin/:id', catchErrors(adminController.getUser));

// update
router.get('/admin/:id/edit', catchErrors(adminController.editUser));
router.post('/admin/:id/edit', catchErrors(adminController.updateUser));

// delete
router.get(
    '/admin/:id/delete',
    userMiddleware.checkIfCurrentUser,
    catchErrors(adminController.deleteUser)
);

// API
router.get('/api/search', catchErrors(ideaController.searchIdeas));
router.get('/api/filter', catchErrors(ideaController.filterIdeas));
router.post(
    '/api/ideas/:id/readinglist',
    catchErrors(ideaController.readingList)
);
router.post('/api/ideas/:id/hearts', catchErrors(ideaController.heartIdea));

module.exports = router;
