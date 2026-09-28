import React, { useEffect, useState } from 'react';
import { runBacktest, getAllFeedback } from '../api/api';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';

const Evaluation = () => {
  const [backtest, setBacktest] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvalData = async () => {
      try {
        const [btData, fbData] = await Promise.all([runBacktest(20), getAllFeedback()]);
        setBacktest(btData);
        setFeedbacks(fbData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvalData();
  }, []);

  if (loading) return <div className="p-8 text-center bg-white border border-gray-200 rounded text-sm text-gray-500">Loading evaluation data...</div>;
  if (!backtest) return <div className="p-4 text-center text-red-500 border border-red-200 bg-red-50 text-sm">Failed to load evaluation data</div>;

  const { summary, results } = backtest;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black mb-1 tracking-tight">AI Evaluation</h1>
        <p className="text-sm text-gray-500 mb-6">DeployMind backtests itself against historical outcomes to measure risk detection.</p>
        
        <div className="bg-gray-100 p-4 border border-gray-200 rounded-md text-xs font-mono text-center flex items-center justify-center space-x-2 text-gray-600 mb-8 overflow-x-auto">
          <span>Deployment</span>
          <span className="text-gray-400">→</span>
          <span>Hindsight Memory</span>
          <span className="text-gray-400">→</span>
          <span>Groq Risk Analysis</span>
          <span className="text-gray-400">→</span>
          <span>Actual Outcome</span>
          <span className="text-gray-400">→</span>
          <span>Reflection</span>
          <span className="text-gray-400">→</span>
          <span>Hindsight</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black mb-4">Scorecard</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard title="Total Evaluated" value={summary.totalEvaluated} />
          <StatCard title="Risk Detection Rate" value={summary.riskDetectionRate !== null ? `${summary.riskDetectionRate}%` : 'Not available'} />
          <StatCard title="Missed Failures" value={summary.missedFailures} />
          <StatCard title="False Alarms" value={summary.falseAlarms} />
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded text-sm">
          <h3 className="font-bold text-gray-800 mb-2">Evaluation Limitations</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Evaluation is based on completed historical deployments available in the current dataset.</li>
            <li><strong>100% risk detection is measured on {summary.failuresOrRollbacks} historical failures; successful deployments are not yet available for evaluating false alarms or safe predictions.</strong></li>
            {summary.safePredictionRate === null && (
              <li>Safe-prediction performance cannot yet be measured because the evaluation dataset contains no successful/no-issue deployments.</li>
            )}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black mb-4">Individual Results</h2>
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deployment</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Version</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Predicted Risk</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actual Outcome</th>
                <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm text-gray-800 font-mono">#{r.deploymentId}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-black">{r.service}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono bg-gray-50 rounded px-1.5 inline-block mt-2 border border-gray-200">{r.version}</td>
                  <td className="px-4 py-3 text-sm"><RiskBadge level={r.predictedRisk} /></td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={r.actualOutcome} /></td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-700">{r.classification.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-black mb-4">Recent Deployment Outcomes</h2>
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-gray-500 border border-gray-200 rounded bg-white text-sm">No feedback records found.</div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="bg-white border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-sm text-black">Deployment #{fb.deployment_id}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleString()}</span>
                  </div>
                  <StatusBadge status={fb.outcome} />
                </div>
                <div className="text-sm text-gray-700 mb-2"><strong>Feedback:</strong> {fb.feedback}</div>
                <div className="grid grid-cols-2 gap-4 text-xs mt-4 pt-4 border-t border-gray-100">
                  <div><span className="font-bold text-gray-500">Actual Issue:</span> <span className="text-black">{fb.actual_issue || 'N/A'}</span></div>
                  <div><span className="font-bold text-gray-500">Root Cause:</span> <span className="text-black">{fb.actual_root_cause || 'N/A'}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Evaluation;
