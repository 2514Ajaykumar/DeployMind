import React from 'react';

const RiskBadge = ({ level }) => {
  const styles = {
    LOW: 'bg-green-50 text-green-800 border-green-300',
    MEDIUM: 'bg-yellow-50 text-yellow-800 border-yellow-400',
    HIGH: 'bg-red-50 text-red-800 border-red-300'
  };

  return (
    <span className={`inline-flex px-2.5 py-1 text-xs font-bold uppercase rounded border shadow-sm ${styles[level] || 'bg-gray-50 text-gray-800 border-gray-200'}`}>
      {level} RISK
    </span>
  );
};

export default RiskBadge;
