import React from 'react';
import RiskBadge from './RiskBadge';
import MemoryFlow from './MemoryFlow';
import FeedbackSection from './FeedbackSection';

const RiskAnalysis = ({ analysis, onClose }) => {
  if (!analysis) return null;

  return (
    <div className="bg-white border border-gray-300 rounded mb-8 shadow-sm">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex justify-between items-center">
        <h2 className="text-sm font-bold text-black uppercase tracking-wider">AI Deployment Risk Analysis</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
      </div>
      
      <div className="p-6">
        <MemoryFlow />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 pr-0 md:pr-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Risk Level</p>
              <RiskBadge level={analysis.riskLevel} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Risk Score</p>
              <p className="text-4xl font-medium text-black">{analysis.riskScore} <span className="text-lg text-gray-400 font-normal">/ 100</span></p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Confidence</p>
              <p className="text-xs font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">{analysis.confidence}</p>
            </div>
          </div>
          
          <div className="space-y-6 md:col-span-3">
            <div className="bg-white border border-gray-300 rounded p-5 border-l-4 border-l-black shadow-sm">
              <p className="text-sm font-bold text-black tracking-tight mb-1">Historical Memory from Hindsight</p>
              <p className="text-xs text-gray-500 mb-4">Relevant deployment history recalled from Hindsight.</p>
              <ul className="space-y-2">
                {analysis.historicalEvidence.map((ev, i) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start leading-relaxed">
                    <span className="text-black mr-2 mt-0.5 font-bold">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="px-1">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Risk Reasons</p>
              <ul className="space-y-2">
                {analysis.riskReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-gray-400 mr-2 mt-0.5">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-5">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Recommendation</p>
              <p className="text-sm font-medium text-black leading-relaxed">{analysis.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      <FeedbackSection deploymentId={analysis.deploymentId} predictedRisk={analysis.riskLevel} />
    </div>
  );
};

export default RiskAnalysis;
