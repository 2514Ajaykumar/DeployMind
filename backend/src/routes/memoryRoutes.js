const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');

router.post('/test-retain', memoryController.testRetain);
router.post('/test-recall', memoryController.testRecall);

module.exports = router;
