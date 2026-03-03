import React from 'react';

const EmptyState = ({ message = 'No data available' }) => {
    return (
        <div className="empty-state">
            <p className="empty-message">{message}</p>
        </div>
    );
};

export default EmptyState;
