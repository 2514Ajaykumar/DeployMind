import React, { useState, useEffect } from 'react';
import { getFeedbackByDeploymentId, submitFeedback } from '../api/api';
import StatusBadge from './StatusBadge';

const FeedbackSection = ({ deploymentId, predictedRisk }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  const [formData, setFormData] = useState({
    outcome: 'SUCCESS',
    feedback: '',
    actualIssue: '',
    actualRootCause: ''
  });

  useEffect(() => {
    fetchFeedback();
  }, [deploymentId]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const fb = await getFeedbackByDeploymentId(deploymentId);
      if (fb && fb.length > 0) {
        setFeedback(fb[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const result = await submitFeedback({ deploymentId, ...formData });
      setFeedback(result);
      setSuccessMsg("Outcome recorded. Reflection added to Hindsight memory.");
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-xs text-gray-500 p-4">Loading outcome data...</div>;

  if (feedback) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-black">Recorded Outcome</h3>
          <span className="text-xs text-gray-500">{new Date(feedback.created_at).toLocaleString()}</span>
        </div>
        
        {predictedRisk && (
          <div className="mb-4 bg-white p-3 border border-gray-200 rounded text-sm flex items-center justify-between">
            <span className="font-medium text-gray-700">Prediction vs Outcome:</span>
            <div className="flex items-center space-x-3 font-bold">
              <span className="text-gray-900">{predictedRisk}</span>
              <span className="text-gray-400">→</span>
              <span className="text-gray-900">{feedback.outcome}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Actual Outcome</div>
            <StatusBadge status={feedback.outcome} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Engineer Feedback</div>
            <div className="text-black bg-white p-2 border border-gray-200 rounded">{feedback.feedback || 'N/A'}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Actual Issue</div>
              <div className="text-black bg-white p-2 border border-gray-200 rounded">{feedback.actual_issue || 'N/A'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Actual Root Cause</div>
              <div className="text-black bg-white p-2 border border-gray-200 rounded">{feedback.actual_root_cause || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {successMsg && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded">
            {successMsg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-4">
      <h3 className="text-sm font-bold text-black mb-4">Deployment Outcome</h3>
      
      {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs border border-red-200 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Outcome</label>
          <select 
            value={formData.outcome}
            onChange={(e) => setFormData({...formData, outcome: e.target.value})}
            className="block w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border bg-white focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="ROLLED_BACK">ROLLED_BACK</option>
            <option value="NO_ISSUE">NO_ISSUE</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Feedback</label>
          <textarea 
            value={formData.feedback}
            onChange={(e) => setFormData({...formData, feedback: e.target.value})}
            className="block w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border bg-white focus:outline-none focus:ring-1 focus:ring-black"
            rows="2"
            placeholder="Describe what happened..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Actual Issue (Optional)</label>
            <input 
              type="text"
              value={formData.actualIssue}
              onChange={(e) => setFormData({...formData, actualIssue: e.target.value})}
              className="block w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">Actual Root Cause (Optional)</label>
            <input 
              type="text"
              value={formData.actualRootCause}
              onChange={(e) => setFormData({...formData, actualRootCause: e.target.value})}
              className="block w-full border-gray-300 rounded-md shadow-sm text-sm p-2 border bg-white focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full bg-black text-white px-4 py-2 rounded text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Outcome'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackSection;
