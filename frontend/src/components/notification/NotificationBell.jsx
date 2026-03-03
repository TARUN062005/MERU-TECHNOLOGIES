import React from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationBell = () => {
    const { bellCount, clearBell } = useNotification();

    return (
        <div className="bell-container" onClick={clearBell}>
            <span className="bell-icon">🔔</span>
            {bellCount > 0 && <span className="bell-badge">{bellCount}</span>}
        </div>
    );
};

export default NotificationBell;
