const incidentService = require('../services/incidentService');
const memoryService = require('../services/memoryService');

const createIncident = (req, res) => {
  try {
    const { deploymentId, title, error, rootCause, resolution } = req.body;
    
    if (!deploymentId) return res.status(400).json({ error: 'deploymentId is required' });
    if (!title) return res.status(400).json({ error: 'title is required' });

    const newIncident = incidentService.createIncident(
      deploymentId, title, error, rootCause, resolution
    );
    
    // Asynchronously ingest memory without blocking response
    memoryService.ingestIncident(newIncident);
    
    res.status(201).json(newIncident);
  } catch (err) {
    if (err.message === 'Deployment not found') {
      return res.status(404).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllIncidents = (req, res) => {
  try {
    const incidents = incidentService.getAllIncidents();
    res.status(200).json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getIncidentById = (req, res) => {
  try {
    const incident = incidentService.getIncidentById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.status(200).json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createIncident,
  getAllIncidents,
  getIncidentById
};
