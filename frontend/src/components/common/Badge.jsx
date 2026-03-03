import React from 'react';

const Badge = ({ status, isArchived }) => {
    if (isArchived) return <span className="badge badge-error"><span className="badge-dot"></span>ARCHIVED</span>;
    const safeStatus = status ? status.toUpperCase() : 'DRAFT';
    return (
        <span className={`badge badge-${safeStatus}`}>
            <span className="badge-dot"></span>
            {safeStatus}
        </span>
    );
};

export default Badge;
