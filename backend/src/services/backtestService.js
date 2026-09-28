const deploymentService = require('./deploymentService');
const agentService = require('./agentService');
const feedbackService = require('./feedbackService');
const scorecardService = require('./scorecardService');
const { db } = require('../db/database');

const runBacktest = async (limit = 20, serviceId = null) => {
  let query = `
    SELECT d.*, s.name as service_name 
    FROM deployments d 
    JOIN services s ON d.service_id = s.id 
    WHERE d.status != 'IN_PROGRESS'
  `;
  const params = [];
  if (serviceId) {
    query += ` AND d.service_id = ?`;
    params.push(serviceId);
  }
  query += ` ORDER BY d.id ASC LIMIT ?`;
  params.push(limit);

  const deployments = db.prepare(query).all(...params);
  const results = [];

  for (const dep of deployments) {
    let actualOutcome = dep.status;
    const feedbackRecords = feedbackService.getFeedbackByDeploymentId(dep.id);
    if (feedbackRecords && feedbackRecords.length > 0) {
      actualOutcome = feedbackRecords[0].outcome;
    }

    try {
      console.log(`[Backtest] Analyzing Deployment #${dep.id} (${dep.version})`);
      const analysis = await agentService.analyzeDeployment(dep, true); // true = isBacktest
      
      results.push({
        deploymentId: dep.id,
        service: dep.service_name,
        version: dep.version,
        actualOutcome,
        predictedRisk: analysis.riskLevel,
        riskScore: analysis.riskScore,
        confidence: analysis.confidence
      });
    } catch (err) {
      console.error(`[Backtest] Failed to analyze deployment #${dep.id}`, err.message);
    }
  }

  const summary = scorecardService.calculateScorecard(results);

  return {
    success: true,
    summary,
    results
  };
};

module.exports = { runBacktest };
