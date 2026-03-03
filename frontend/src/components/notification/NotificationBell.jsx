import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Bell } from 'lucide-react';
import { format } from 'date-fns';

const NotificationBell = () => {
    const { bellCount, notifications, markAsRead } = useNotification();
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen(!open);
        if (!open && bellCount > 0) {
            markAsRead();
        }
    };

    return (
        <div className="bell-container" onClick={toggleOpen}>
            <Bell size={20} className="text-muted" />
            {bellCount > 0 && <span className="bell-badge">{bellCount}</span>}

            {open && (
                <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                        Notifications
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-40 text-center text-muted">No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div key={n._id} className="notification-item">
                                <div style={{ fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className={`badge-dot`} style={{ color: n.type === 'error' ? 'var(--error)' : 'var(--primary-color)' }}></span>
                                    {n.message}
                                </div>
                                <div className="time">{format(new Date(n.createdAt), 'MMM dd, h:mm a')}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
