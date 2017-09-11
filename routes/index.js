const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');
const { catchErrors } = require('../handlers/errorHandlers');

// Routes
router.get('/', catchErrors(ideaController.homePage));
router.get('/ideas/add', ideaController.addIdea);
router.post('/ideas/add', catchErrors(ideaController.createIdea));
router.post('/ideas/add/:id', catchErrors(ideaController.updateIdea));
router.get('/ideas/:id', catchErrors(ideaController.getIdea));
router.get('/idea/:id/edit', catchErrors(ideaController.editIdea));


module.exports = router;