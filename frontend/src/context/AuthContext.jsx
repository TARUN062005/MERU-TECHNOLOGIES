import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from './NotificationContext';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;
// Inactivity check interval (1 minute)
const INACTIVITY_CHECK_INTERVAL = 60 * 1000;

export const AuthProvider = ({ children }) => {
    const { addNotification } = useNotification();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const sessionTimerRef = useRef(null);
    const inactivityTimerRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    // Track user activity
    const updateActivity = () => {
        lastActivityRef.current = Date.now();
    };

    // Clear all timers
    const clearSessionTimers = () => {
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
        }
        if (inactivityTimerRef.current) {
            clearInterval(inactivityTimerRef.current);
        }
    };

    // Set up session timeout
    const setupSessionTimeout = () => {
        clearSessionTimers();
        lastActivityRef.current = Date.now();

        // Check for inactivity periodically
        inactivityTimerRef.current = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityRef.current;
            if (timeSinceLastActivity > SESSION_TIMEOUT) {
                addNotification('Session expired due to inactivity. Please login again.', 'warning');
                logoutInternal();
            }
        }, INACTIVITY_CHECK_INTERVAL);
    };

    // Internal logout without notification
    const logoutInternal = () => {
        clearSessionTimers();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('lastActivityTime');
        setUser(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp * 1000 < Date.now()) {
                    logoutInternal();
                } else {
                    setUser(parsedUser);
                    setupSessionTimeout();
                }
            } catch (err) {
                logoutInternal();
            }
        }
        setLoading(false);

        // Add event listeners for user activity
        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(event => {
            window.addEventListener(event, updateActivity, true);
        });

        return () => {
            activityEvents.forEach(event => {
                window.removeEventListener(event, updateActivity, true);
            });
            clearSessionTimers();
        };
    }, []);

    const registerUser = async (name, email, password) => {
        try {
            const { data } = await axiosInstance.post('/auth/register', { name, email, password });
            console.log('Registration successful, email sent.');
            addNotification(`Registered successfully! Please check your email to verify.`, 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Registration failed', 'error');
            throw error;
        }
    };

    const loginUser = async (email, password) => {
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('sessionStartTime', Date.now().toString());
            localStorage.setItem('lastActivityTime', Date.now().toString());
            setUser(data);
            setupSessionTimeout();
            addNotification('Logged in successfully!', 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Login failed', 'error');
            throw error;
        }
    };

    const verifyEmail = async (token) => {
        try {
            const { data } = await axiosInstance.post('/auth/verify', { token });
            addNotification('Email verified successfully!', 'success');
            if (user) {
                const updatedUser = { ...user, isVerified: true };
                setUser(updatedUser);
                localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            }
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Verification failed', 'error');
            throw error;
        }
    };

    const googleLogin = async (token) => {
        try {
            const { data } = await axiosInstance.post('/auth/google', { token });
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('sessionStartTime', Date.now().toString());
            localStorage.setItem('lastActivityTime', Date.now().toString());
            setUser(data);
            setupSessionTimeout();
            addNotification('Logged in with Google!', 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Google login failed', 'error');
            throw error;
        }
    };

    const resendVerification = async () => {
        try {
            const { data } = await axiosInstance.post('/auth/resend-verification');
            addNotification('Verification email resent successfully!', 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Failed to resend verification', 'error');
            throw error;
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const { data } = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
            addNotification('Password changed successfully!', 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Failed to change password', 'error');
            throw error;
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const { data } = await axiosInstance.put('/auth/profile', profileData);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            addNotification('Profile updated successfully!', 'success');
            return data;
        } catch (error) {
            addNotification(error.response?.data?.message || 'Failed to update profile', 'error');
            throw error;
        }
    };

    const logout = () => {
        clearSessionTimers();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('sessionStartTime');
        localStorage.removeItem('lastActivityTime');
        setUser(null);
        addNotification('Logged out successfully!', 'success');
    };

    return (
        <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logout, verifyEmail, googleLogin, resendVerification, changePassword, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
