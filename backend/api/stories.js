// routes/stories.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/storiesController');

router.get('/', ctrl.getAllStories);
router.get('/:id', ctrl.getStoryById);
router.post('/', ctrl.createStory);
router.put('/:id', ctrl.updateStory);
router.delete('/:id', ctrl.deleteStory);

module.exports = router;
