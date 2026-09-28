const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getFeedback);
router.get('/:deploymentId', feedbackController.getFeedbackByDeploymentId);

module.exports = router;
