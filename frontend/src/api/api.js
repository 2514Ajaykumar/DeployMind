import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

export const getServices = () => api.get('/services').then(res => res.data);
export const getHealth = () => api.get('/health').then(res => res.data);
export const getDeployments = () => api.get('/deployments').then(res => res.data);
export const getDeployment = (id) => api.get(`/deployments/${id}`).then(res => res.data);
export const getIncidents = () => api.get('/incidents').then(res => res.data);
export const getInfrastructureChanges = () => api.get('/infrastructure-changes').then(res => res.data);
export const analyzeDeployment = (deploymentId) => api.post('/agent/analyze-deployment', { deploymentId }).then(res => res.data);

// Phase 9: Backtest and Feedback
export const runBacktest = (limit = 20) => api.post('/agent/backtest', { limit }).then(res => res.data);
export const submitFeedback = (data) => api.post('/feedback', data).then(res => res.data);
export const getFeedbackByDeploymentId = (id) => api.get(`/feedback/${id}`).then(res => res.data);
export const getAllFeedback = () => api.get('/feedback').then(res => res.data);

export default api;
