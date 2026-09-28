import React, { useEffect, useState } from 'react';
import { getDeployments, analyzeDeployment } from '../api/api';
import DeploymentTable from '../components/DeploymentTable';
import RiskAnalysis from '../components/RiskAnalysis';
import DeploymentDetails from '../components/DeploymentDetails';

const Deployments = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [analysis, setAnalysis] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const data = await getDeployments();
        setDeployments(data);
      } catch (err) {
        setError('Failed to load deployments. Backend might be unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, []);

  const handleAnalyze = async (id) => {
    setAnalyzingId(id);
    setAnalysis(null);
    setAnalysisError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await analyzeDeployment(id);
      setAnalysis({ deploymentId: id, ...data });
    } catch (err) {
      setAnalysisError(err.response?.data?.error || err.message || 'Failed to analyze deployment');
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) return <div className="text-gray-500 p-8 text-center bg-white border border-gray-200 rounded text-sm">Loading deployments...</div>;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-1 tracking-tight">Deployments</h1>
        <p className="text-sm text-gray-500">Track deployment history and analyze production risk using historical memory.</p>
      </div>

      {analyzingId && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded text-center text-sm font-semibold text-black animate-pulse mb-6 shadow-sm">
          Analyzing deployment...
        </div>
      )}

      {analysisError && (
        <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200 mb-6 font-medium text-sm shadow-sm">
          {analysisError}
        </div>
      )}

      <RiskAnalysis analysis={analysis} onClose={() => setAnalysis(null)} />
      
      <DeploymentDetails deployment={selectedDeployment} onClose={() => setSelectedDeployment(null)} />

      <DeploymentTable 
        deployments={deployments} 
        onAnalyze={handleAnalyze} 
        analyzingId={analyzingId}
        onSelect={setSelectedDeployment} 
      />
    </div>
  );
};

export default Deployments;
