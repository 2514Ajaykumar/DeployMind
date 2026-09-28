const { db } = require('../db/database');

const createDeployment = (serviceId, version, commitHash, environment, status, duration, changes) => {
  // Validate if service exists first
  const service = db.prepare('SELECT id FROM services WHERE id = ?').get(serviceId);
  if (!service) {
    throw new Error('Service not found');
  }

  const changesStr = changes ? JSON.stringify(changes) : null;
  
  const stmt = db.prepare(`
    INSERT INTO deployments (service_id, version, commit_hash, environment, status, duration, changes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(serviceId, version, commitHash || null, environment, status, duration || null, changesStr);
  return getDeploymentById(info.lastInsertRowid);
};

const getAllDeployments = () => {
  return db.prepare(`
    SELECT d.*, s.name as service_name 
    FROM deployments d 
    LEFT JOIN services s ON d.service_id = s.id 
    ORDER BY d.created_at DESC
  `).all();
};

const getDeploymentById = (id) => {
  return db.prepare(`
    SELECT d.*, s.name as service_name, s.repository as service_repository 
    FROM deployments d 
    LEFT JOIN services s ON d.service_id = s.id 
    WHERE d.id = ?
  `).get(id);
};

const updateDeploymentRiskAnalysis = (id, analysis) => {
  const stmt = db.prepare('UPDATE deployments SET risk_analysis = ? WHERE id = ?');
  return stmt.run(JSON.stringify(analysis), id);
};

module.exports = {
  createDeployment,
  getAllDeployments,
  getDeploymentById,
  updateDeploymentRiskAnalysis
};
