const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const commentController = require('../controllers/commentController');
const userMiddleware = require('../middleware/userMiddleware');
const { catchErrors } = require('../handlers/errorHandlers');

// INDEX
router.get(
    '/',
    authController.checkIfLoggedIn,
    userMiddleware.isCurrentUser,
    catchErrors(ideaController.homePage)
);

router.get(
    '/pages/:page',
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
router.get(
    '/ideas/:id',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.getIdea)
);

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

// -- explore --
router.get(
    '/explore',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.explore)
);

// -- popular --
router.get(
    '/popular',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.popular)
);

// -- get users who hearted idea
router.get(
    '/idea/:id/hearts',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.getHearts)
);

// COMMENTS
// -- create --
router.post(
    '/comments/:id',
    authController.checkIfLoggedIn,
    catchErrors(commentController.addComment)
);

// -- update --
router.get(
    '/comment/:id/edit',
    authController.checkIfLoggedIn,
    catchErrors(commentController.editComment)
);

router.post(
    '/comment/:id/edit',
    authController.checkIfLoggedIn,
    catchErrors(commentController.updateComment)
);

// -- delete --
router.get(
    '/comment/:id/delete',
    authController.checkIfLoggedIn,
    catchErrors(commentController.deleteComment)
);

// READINGLIST
// -- read --
router.get(
    '/readinglist',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.getReadingList)
);

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
router.get(
    '/admin/:id',
    authController.checkIfLoggedIn,
    catchErrors(adminController.getUser)
);

// update
router.get('/admin/:id/edit', catchErrors(adminController.editUser));
router.post('/admin/:id/edit', catchErrors(adminController.updateUser));

// delete
router.get(
    '/admin/:id/delete',
    userMiddleware.checkIfCurrentUser,
    catchErrors(adminController.deleteUser)
);

// -- admin API --

router.post(
    '/api/admin/ideas/:id/visibility',
    authController.checkIfLoggedIn,
    adminController.ideasVisibility
)

// USERS
router.get(
    '/users/:id',
    authController.checkIfLoggedIn,
    catchErrors(userController.getUser)
);

// USER
router.get(
    '/user/:id/edit',
    authController.checkIfLoggedIn,
    userController.editAccount
);
router.post(
    '/user/:id/edit',
    ideaController.upload,
    catchErrors(ideaController.resize),
    catchErrors(userController.updateUserAccount)
);

// API
router.get('/api/search', catchErrors(ideaController.searchIdeas));
router.get('/api/filter', catchErrors(ideaController.filterIdeas));
router.post(
    '/api/ideas/:id/readinglist',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.readingList)
);
router.post(
    '/api/ideas/:id/hearts',
    authController.checkIfLoggedIn,
    catchErrors(ideaController.heartIdea)
);

router.post(
    '/api/:id/followers',
    authController.checkIfLoggedIn,
    catchErrors(userController.followers)
);

module.exports = router;
