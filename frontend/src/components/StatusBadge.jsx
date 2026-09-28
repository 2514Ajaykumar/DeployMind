import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    SUCCESS: 'bg-green-50 text-green-700 border-green-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    ROLLBACK: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  const defaultStyle = 'bg-gray-50 text-gray-700 border-gray-200';
  const appliedStyle = styles[status] || defaultStyle;

  return (
    <span className={`inline-flex px-2 py-0.5 text-[11px] font-bold tracking-wider rounded border ${appliedStyle}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
