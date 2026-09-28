const hindsightService = require('./hindsightService');

const createReflection = async (deployment, feedbackData) => {
  console.log('[Reflection] Generating reflection memory');
  
  let predictedRisk = 'Unknown';
  if (deployment.risk_analysis) {
    try {
      const analysis = JSON.parse(deployment.risk_analysis);
      predictedRisk = analysis.riskLevel || 'Unknown';
    } catch (e) {}
  }
  
  const memoryText = `Deployment Reflection:
Service: ${deployment.service_name}
Deployment version: ${deployment.version}
Predicted risk: ${predictedRisk}
Actual outcome: ${feedbackData.outcome}
Actual issue: ${feedbackData.actualIssue || 'N/A'}
Actual root cause: ${feedbackData.actualRootCause || 'N/A'}
Engineer feedback: ${feedbackData.feedback || 'None provided'}`;
  
  try {
    await hindsightService.retainMemory({ text: memoryText });
    console.log('[Reflection] Reflection stored in Hindsight successfully');
  } catch (error) {
    console.error('[Reflection] Feedback stored but Hindsight reflection failed:', error.message);
  }
};

module.exports = {
  createReflection
};
