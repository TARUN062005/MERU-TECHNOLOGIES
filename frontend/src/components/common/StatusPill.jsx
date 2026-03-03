import React from 'react';

const StatusPill = ({ status, isOverdue }) => {
    let variant = 'warning';
    let displayText = status;

    if (status === 'PAID') {
        variant = 'success';
    } else if (isOverdue) {
        variant = 'danger';
        displayText = 'OVERDUE';
    }

    return (
        <div className={`status-pill pill-${variant}`}>
            {displayText}
        </div>
    );
};

export default StatusPill;
