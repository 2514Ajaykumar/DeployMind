const express = require('express');

const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const serviceRoutes = require('./routes/serviceRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const infrastructureChangeRoutes = require('./routes/infrastructureChangeRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const agentRoutes = require('./routes/agentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/infrastructure-changes', infrastructureChangeRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'DeployMind API'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
