const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

router.post('/', deploymentController.createDeployment);
router.get('/', deploymentController.getAllDeployments);
router.get('/:id', deploymentController.getDeploymentById);

module.exports = router;
