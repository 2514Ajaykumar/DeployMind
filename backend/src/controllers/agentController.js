const llmService = require('../services/llmService');
const agentService = require('../services/agentService');
const deploymentService = require('../services/deploymentService');
const backtestService = require('../services/backtestService');

const testLlm = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'prompt is required in body' });
    }
    
    const response = await llmService.generateResponse(prompt);
    
    res.status(200).json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Error testing LLM:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

const analyzeDeployment = async (req, res) => {
  try {
    const { deploymentId } = req.body;
    
    if (!deploymentId) {
      return res.status(400).json({ error: 'deploymentId is required' });
    }
    
    const deployment = deploymentService.getDeploymentById(deploymentId);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    const analysis = await agentService.analyzeDeployment(deployment);
    
    try {
      deploymentService.updateDeploymentRiskAnalysis(deploymentId, analysis);
    } catch (err) {
      console.error('Failed to store risk analysis:', err);
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Error analyzing deployment:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const runBacktest = async (req, res) => {
  try {
    const { serviceId, limit } = req.body;
    const results = await backtestService.runBacktest(limit || 20, serviceId);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error running backtest:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  testLlm,
  analyzeDeployment,
  runBacktest
};
