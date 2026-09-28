import React from 'react';
import StatusBadge from './StatusBadge';

const DeploymentDetails = ({ deployment, onClose }) => {
  if (!deployment) return null;

  let changes = [];
  try {
    if (deployment.changes) {
      changes = typeof deployment.changes === 'string' ? JSON.parse(deployment.changes) : deployment.changes;
    }
  } catch (e) {}

  return (
    <div className="bg-white border border-gray-200 rounded mb-8 shadow-sm">
      <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-xs font-bold text-black uppercase tracking-wider">Deployment Details</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Service</p>
          <p className="text-sm font-medium text-black">{deployment.service_name}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Version</p>
          <p className="text-sm font-mono text-gray-800">{deployment.version}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Environment</p>
          <p className="text-sm text-gray-800">{deployment.environment}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
          <StatusBadge status={deployment.status} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Commit</p>
          <p className="text-sm font-mono text-gray-800">{deployment.commit_hash || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</p>
          <p className="text-sm text-gray-800">{deployment.duration !== null ? `${deployment.duration}s` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Created At</p>
          <p className="text-sm text-gray-800">{new Date(deployment.created_at).toLocaleString()}</p>
        </div>
      </div>
      
      {Array.isArray(changes) && changes.length > 0 && (
        <div className="px-5 pb-5">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Changes</p>
          <div className="bg-white border border-gray-200 rounded p-3">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[10px] text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-2 py-1 font-semibold">Component</th>
                  <th className="px-2 py-1 font-semibold">Old Value</th>
                  <th className="px-2 py-1 font-semibold">New Value</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((change, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-2 py-2 font-mono text-xs">{change.component}</td>
                    <td className="px-2 py-2 text-gray-500 line-through">{change.oldValue}</td>
                    <td className="px-2 py-2 font-semibold text-black">{change.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentDetails;
