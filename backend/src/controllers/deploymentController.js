const deploymentService = require('../services/deploymentService');
const memoryService = require('../services/memoryService');

const createDeployment = (req, res) => {
  try {
    const { serviceId, version, commitHash, environment, status, duration, changes } = req.body;
    
    // Validation
    if (!serviceId) return res.status(400).json({ error: 'serviceId is required' });
    if (!version) return res.status(400).json({ error: 'version is required' });
    if (!environment) return res.status(400).json({ error: 'environment is required' });
    if (!status) return res.status(400).json({ error: 'status is required' });
    
    const validStatuses = ['SUCCESS', 'FAILED', 'ROLLBACK', 'IN_PROGRESS'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be SUCCESS, FAILED, ROLLBACK, or IN_PROGRESS' });
    }

    const newDeployment = deploymentService.createDeployment(
      serviceId, version, commitHash, environment, status, duration, changes
    );
    
    // Asynchronously ingest memory without blocking response
    memoryService.ingestDeployment(newDeployment);
    
    res.status(201).json(newDeployment);
  } catch (error) {
    if (error.message === 'Service not found') {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllDeployments = (req, res) => {
  try {
    const deployments = deploymentService.getAllDeployments();
    // Parse changes JSON string back to object
    const mapped = deployments.map(d => ({
      ...d,
      changes: d.changes ? JSON.parse(d.changes) : null
    }));
    res.status(200).json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getDeploymentById = (req, res) => {
  try {
    const deployment = deploymentService.getDeploymentById(req.params.id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    
    deployment.changes = deployment.changes ? JSON.parse(deployment.changes) : null;
    res.status(200).json(deployment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createDeployment,
  getAllDeployments,
  getDeploymentById
};
