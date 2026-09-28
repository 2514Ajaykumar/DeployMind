import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getDeployments, getIncidents, getInfrastructureChanges } from '../api/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

const Overview = () => {
  const [data, setData] = useState({
    services: [],
    deployments: [],
    incidents: [],
    infrastructureChanges: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [services, deployments, incidents, infra] = await Promise.all([
          getServices(),
          getDeployments(),
          getIncidents(),
          getInfrastructureChanges()
        ]);
        
        setData({ services, deployments, incidents, infrastructureChanges: infra });
      } catch (err) {
        setError('Failed to load overview data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-gray-500 p-8 text-center bg-white border border-gray-200 rounded text-sm">Loading overview...</div>;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded border border-red-200 text-sm font-medium">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="bg-black text-white p-6 rounded shadow-sm">
        <h1 className="text-xl font-bold tracking-tight mb-2">DeployMind Agent</h1>
        <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
          DeployMind remembers what happened during previous deployments and uses that history to warn engineers before similar changes cause problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Services" value={data.services.length} />
        <StatCard title="Deployments" value={data.deployments.length} />
        <StatCard title="Incidents" value={data.incidents.length} />
        <StatCard title="Infrastructure Changes" value={data.infrastructureChanges.length} />
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-black">AI Evaluation</h2>
          <Link to="/evaluation" className="text-xs font-medium text-black hover:underline">Run Evaluation</Link>
        </div>
        <div className="p-6 text-center bg-gray-50 text-sm text-gray-600">
          <p className="mb-2">DeployMind evaluates its risk prediction accuracy against historical deployments.</p>
          <Link to="/evaluation" className="inline-block bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            View Evaluation Scorecard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800">Recent Deployments</h2>
            <Link to="/deployments" className="text-xs font-medium text-black hover:underline">View all</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Version</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.deployments.slice(0, 5).map(dep => (
                  <tr key={dep.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-black">{dep.service_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono bg-gray-50 rounded px-1.5 inline-block mt-2 border border-gray-200">{dep.version}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={dep.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500 text-right">{new Date(dep.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.deployments.length === 0 && <tr><td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">No deployments</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800">Recent Incidents</h2>
            <Link to="/incidents" className="text-xs font-medium text-black hover:underline">View all</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Incident</th>
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Service</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.incidents.slice(0, 5).map(inc => (
                  <tr key={inc.id}>
                    <td className="px-4 py-3 text-sm font-semibold text-red-700 truncate max-w-[200px]">{inc.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{inc.service_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 text-right">{new Date(inc.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.incidents.length === 0 && <tr><td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">No incidents</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
