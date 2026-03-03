import React from 'react';
import { useNotification } from '../../context/NotificationContext';

const NotificationToast = () => {
    const { notifications } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className="notification-container">
            {notifications.map(n => (
                <div key={n.id} className={`toast toast-${n.type}`}>
                    {n.message}
                </div>
            ))}
        </div>
    );
};

export default NotificationToast;
