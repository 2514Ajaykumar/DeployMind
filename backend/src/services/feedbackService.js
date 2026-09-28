const db = require('../db/database').db;

const createFeedback = (feedbackData) => {
  const { deploymentId, outcome, feedback, actualIssue, actualRootCause } = feedbackData;
  const stmt = db.prepare(`
    INSERT INTO deployment_feedback (deployment_id, outcome, feedback, actual_issue, actual_root_cause)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(deploymentId, outcome, feedback, actualIssue, actualRootCause);
  return getFeedbackById(info.lastInsertRowid);
};

const getFeedbackById = (id) => {
  return db.prepare('SELECT * FROM deployment_feedback WHERE id = ?').get(id);
};

const getFeedbackByDeploymentId = (deploymentId) => {
  return db.prepare('SELECT * FROM deployment_feedback WHERE deployment_id = ?').all(deploymentId);
};

const getAllFeedback = () => {
  return db.prepare('SELECT * FROM deployment_feedback ORDER BY created_at DESC').all();
};

module.exports = {
  createFeedback,
  getFeedbackById,
  getFeedbackByDeploymentId,
  getAllFeedback
};
