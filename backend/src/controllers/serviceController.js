const serviceService = require('../services/serviceService');

const createService = (req, res) => {
  try {
    const { name, repository, environment } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const newService = serviceService.createService(name, repository, environment);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllServices = (req, res) => {
  try {
    const services = serviceService.getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getServiceById = (req, res) => {
  try {
    const service = serviceService.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById
};
