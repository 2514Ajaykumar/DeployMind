const { db } = require('../db/database');

const createIncident = (deploymentId, title, error, rootCause, resolution) => {
  const deployment = db.prepare('SELECT id FROM deployments WHERE id = ?').get(deploymentId);
  if (!deployment) {
    throw new Error('Deployment not found');
  }

  const stmt = db.prepare(`
    INSERT INTO incidents (deployment_id, title, error, root_cause, resolution)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(deploymentId, title, error || null, rootCause || null, resolution || null);
  return getIncidentById(info.lastInsertRowid);
};

const getAllIncidents = () => {
  return db.prepare(`
    SELECT i.*, d.version, d.environment, d.status as deployment_status, s.name as service_name
    FROM incidents i
    JOIN deployments d ON i.deployment_id = d.id
    JOIN services s ON d.service_id = s.id
    ORDER BY i.created_at DESC
  `).all();
};

const getIncidentById = (id) => {
  return db.prepare(`
    SELECT i.*, d.version, d.environment, d.status as deployment_status, s.name as service_name
    FROM incidents i
    JOIN deployments d ON i.deployment_id = d.id
    JOIN services s ON d.service_id = s.id
    WHERE i.id = ?
  `).get(id);
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById
};
