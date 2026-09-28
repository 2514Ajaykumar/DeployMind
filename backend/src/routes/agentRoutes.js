const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/test-llm', agentController.testLlm);
router.post('/analyze-deployment', agentController.analyzeDeployment);
router.post('/backtest', agentController.runBacktest);

module.exports = router;
