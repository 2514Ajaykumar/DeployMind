const express = require('express');
const router = express.Router();
const infrastructureChangeController = require('../controllers/infrastructureChangeController');

router.post('/', infrastructureChangeController.createInfrastructureChange);
router.get('/', infrastructureChangeController.getAllInfrastructureChanges);
router.get('/:id', infrastructureChangeController.getInfrastructureChangeById);

module.exports = router;
