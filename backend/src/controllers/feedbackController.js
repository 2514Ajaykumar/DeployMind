const feedbackService = require('../services/feedbackService');
const deploymentService = require('../services/deploymentService');
const reflectionService = require('../services/reflectionService');

const createFeedback = async (req, res) => {
  try {
    const { deploymentId, outcome, feedback, actualIssue, actualRootCause } = req.body;
    
    if (!deploymentId || !outcome) {
      return res.status(400).json({ error: 'deploymentId and outcome are required' });
    }
    
    const validOutcomes = ['SUCCESS', 'FAILED', 'ROLLED_BACK', 'NO_ISSUE'];
    if (!validOutcomes.includes(outcome)) {
      return res.status(400).json({ error: 'Invalid outcome value' });
    }

    const deployment = deploymentService.getDeploymentById(deploymentId);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    const storedFeedback = feedbackService.createFeedback({
      deploymentId, outcome, feedback, actualIssue, actualRootCause
    });
    
    // Asynchronously create reflection
    reflectionService.createReflection(deployment, { outcome, feedback, actualIssue, actualRootCause }).catch(err => {
      console.error('[Reflection] Uncaught error during reflection generation:', err);
    });

    res.status(201).json(storedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const getFeedback = (req, res) => {
  try {
    const feedback = feedbackService.getAllFeedback();
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const getFeedbackByDeploymentId = (req, res) => {
  try {
    const { deploymentId } = req.params;
    const feedback = feedbackService.getFeedbackByDeploymentId(deploymentId);
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbackByDeploymentId
};
