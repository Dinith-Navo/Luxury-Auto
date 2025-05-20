const express = require('express');
const router = express.Router();
const MovieController = require('../Controllers/MovieController');
const upload = require('../middleware/multer');

// Routes
router.post('/', upload.single('image'), MovieController.createMovie);
router.get('/', MovieController.getAllMovie);
router.get('/:id', MovieController.getMovieById);
router.put('/:id', upload.single('image'), MovieController.updateMovie);
router.delete('/:id', MovieController.deleteMovie);

module.exports = router;
