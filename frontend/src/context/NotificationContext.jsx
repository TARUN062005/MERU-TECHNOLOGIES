import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [bellCount, setBellCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/notifications');
            setNotifications(res.data);
            setBellCount(res.data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Use a toast state for transient UI popups
    const [toasts, setToasts] = useState([]);

    const addNotification = useCallback(async (message, type = 'success') => {
        // UI Toast
        const toastId = Date.now();
        setToasts(prev => [...prev, { id: toastId, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 4000);

        // Save to MongoDB
        try {
            await axiosInstance.post('/notifications', { message, type });
            fetchNotifications(); // Refresh list to get accurate count
        } catch (err) {
            console.error('Failed to save notification', err);
        }
    }, [fetchNotifications]);

    const markAsRead = async () => {
        setBellCount(0);
        try {
            await axiosInstance.post('/notifications/read');
            fetchNotifications();
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, bellCount, addNotification, markAsRead, toasts }}>
            {children}
            {/* Transient UI Toasts */}
            <div className="notification-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        {toast.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
