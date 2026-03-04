import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNotification } from './NotificationContext';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { addNotification } = useNotification();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const decoded = jwtDecode(parsedUser.token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(parsedUser);
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
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
            setUser(data);
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
            setUser(data);
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

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logout, verifyEmail, googleLogin, resendVerification, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
