import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../notification/NotificationBell';

const Header = () => {
    const navigate = useNavigate();
    return (
        <header className="app-topbar flex-between">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                FinDash
            </div>
            <div className="flex-end">
                <NotificationBell />
            </div>
        </header>
    );
};

export default Header;
