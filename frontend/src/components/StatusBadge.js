import React from 'react';

const StatusBadge = ({ status }) => {
  const config = {
    'Pending': { cls: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-400', label: 'Pending' },
    'In Progress': { cls: 'bg-blue-100 text-blue-700 border border-blue-200', dot: 'bg-blue-500', label: 'In Progress' },
    'Resolved': { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', label: 'Resolved' },
  };

  const { cls, dot, label } = config[status] || config['Pending'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const config = {
    'Low': 'bg-gray-100 text-gray-600 border border-gray-200',
    'Medium': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'High': 'bg-red-100 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[priority] || config['Medium']}`}>
      {priority}
    </span>
  );
};

export default StatusBadge;
