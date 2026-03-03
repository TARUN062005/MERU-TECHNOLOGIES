import React from 'react';

const Badge = ({ status, isArchived }) => {
    if (isArchived) return <span className="badge badge-error">ARCHIVED</span>;
    const variant = status === 'PAID' ? 'badge-success' : 'badge-warning';
    return <span className={`badge ${variant}`}>{status}</span>;
};

export default Badge;
