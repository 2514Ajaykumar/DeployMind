import React from 'react';

const MemoryFlow = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded p-4 text-xs font-medium text-gray-600 mb-6 overflow-x-auto w-full">
      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded">Current Deployment</div>
      <span className="text-gray-300 mx-2">→</span>
      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded">Hindsight Recall</div>
      <span className="text-gray-300 mx-2">→</span>
      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-black font-semibold shadow-sm border-b-2 border-b-black">Historical Memory</div>
      <span className="text-gray-300 mx-2">→</span>
      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded">Groq Reasoning</div>
      <span className="text-gray-300 mx-2">→</span>
      <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-bold text-black">Risk Recommendation</div>
    </div>
  );
};

export default MemoryFlow;
