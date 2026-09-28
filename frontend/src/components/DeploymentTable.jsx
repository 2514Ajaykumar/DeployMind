import React from 'react';
import StatusBadge from './StatusBadge';

const DeploymentTable = ({ deployments, onAnalyze, analyzingId, onSelect }) => {
  if (!deployments || deployments.length === 0) {
    return <div className="p-8 text-center text-gray-500 border border-gray-200 rounded bg-white text-sm">No deployments found.</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Version</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Environment</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deployments.map((dep) => (
              <tr key={dep.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={(e) => { if(onSelect && !e.target.closest('button')) onSelect(dep); }}>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">#{dep.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{dep.service_name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 font-mono bg-gray-50 border border-gray-200 rounded px-1.5 my-2 inline-block ml-4">{dep.version}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600 capitalize">{dep.environment}</td>
                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={dep.status} /></td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{dep.duration !== null ? `${dep.duration}s` : '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{new Date(dep.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  {onAnalyze && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAnalyze(dep.id); }}
                      disabled={analyzingId === dep.id}
                      className="inline-flex items-center text-xs font-semibold bg-white border border-gray-300 text-black px-3 py-1.5 rounded hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      {analyzingId === dep.id ? 'Analyzing...' : 'Analyze Risk'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeploymentTable;
