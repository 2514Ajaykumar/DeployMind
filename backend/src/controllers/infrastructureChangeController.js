const infrastructureChangeService = require('../services/infrastructureChangeService');
const memoryService = require('../services/memoryService');

const createInfrastructureChange = (req, res) => {
  try {
    const { deploymentId, component, oldValue, newValue } = req.body;
    
    if (!deploymentId) return res.status(400).json({ error: 'deploymentId is required' });
    if (!component) return res.status(400).json({ error: 'component is required' });

    const newChange = infrastructureChangeService.createInfrastructureChange(
      deploymentId, component, oldValue, newValue
    );
    
    // Asynchronously ingest memory without blocking response
    memoryService.ingestInfrastructureChange(newChange);
    
    res.status(201).json(newChange);
  } catch (err) {
    if (err.message === 'Deployment not found') {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllInfrastructureChanges = (req, res) => {
  try {
    const changes = infrastructureChangeService.getAllInfrastructureChanges();
    res.status(200).json(changes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getInfrastructureChangeById = (req, res) => {
  try {
    const change = infrastructureChangeService.getInfrastructureChangeById(req.params.id);
    if (!change) {
      return res.status(404).json({ error: 'Infrastructure change not found' });
    }
    res.status(200).json(change);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createInfrastructureChange,
  getAllInfrastructureChanges,
  getInfrastructureChangeById
};
