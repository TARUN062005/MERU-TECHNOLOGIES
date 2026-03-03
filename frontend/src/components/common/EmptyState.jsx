import React from 'react';

const EmptyState = ({ message = 'No data available', icon = null }) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-icon">{icon}</div>}
            <p className="empty-message">{message}</p>
        </div>
    );
};

export default EmptyState;
