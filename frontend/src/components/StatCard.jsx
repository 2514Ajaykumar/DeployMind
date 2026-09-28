import React from 'react';

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{title}</p>
    <p className="text-3xl font-medium text-black">{value}</p>
  </div>
);

export default StatCard;
