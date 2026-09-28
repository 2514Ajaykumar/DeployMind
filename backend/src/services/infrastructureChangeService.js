const { db } = require('../db/database');

const createInfrastructureChange = (deploymentId, component, oldValue, newValue) => {
  const deployment = db.prepare('SELECT id FROM deployments WHERE id = ?').get(deploymentId);
  if (!deployment) {
    throw new Error('Deployment not found');
  }

  const stmt = db.prepare(`
    INSERT INTO infrastructure_changes (deployment_id, component, old_value, new_value)
    VALUES (?, ?, ?, ?)
  `);
  
  const info = stmt.run(deploymentId, component, oldValue || null, newValue || null);
  return getInfrastructureChangeById(info.lastInsertRowid);
};

const getAllInfrastructureChanges = () => {
  return db.prepare(`
    SELECT ic.*, d.version, d.environment, s.name as service_name
    FROM infrastructure_changes ic
    JOIN deployments d ON ic.deployment_id = d.id
    JOIN services s ON d.service_id = s.id
    ORDER BY ic.created_at DESC
  `).all();
};

const getInfrastructureChangeById = (id) => {
  return db.prepare(`
    SELECT ic.*, d.version, d.environment, s.name as service_name
    FROM infrastructure_changes ic
    JOIN deployments d ON ic.deployment_id = d.id
    JOIN services s ON d.service_id = s.id
    WHERE ic.id = ?
  `).get(id);
};

module.exports = {
  createInfrastructureChange,
  getAllInfrastructureChanges,
  getInfrastructureChangeById
};
