import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Menu, Settings as SettingsIcon, LogOut } from 'lucide-react';
import NotificationBell from '../notification/NotificationBell';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setProfileOpen(false);
    };

    return (
        <header className="app-topbar">
            {/* Website name aligned top-right is odd but we keep branding left if possible, or follow exact instructions. Let's put search left/center, interactions right */}
            <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    className="mobile-menu-btn"
                    onClick={toggleSidebar}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'none' }}
                >
                    <Menu size={24} className="text-muted" />
                </button>
                <div className="search-box">
                    <Search size={18} className="text-muted" />
                    <input type="text" placeholder="Search invoices..." />
                </div>
            </div>

            <div className="topbar-right" style={{ position: 'relative', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <NotificationBell />
                <div className="bell-container" ref={profileRef} onClick={() => setProfileOpen(!profileOpen)} style={{ position: 'relative' }}>
                    <div className="user-avatar" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: profileOpen ? '0 0 0 2px var(--primary-color)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: '#fff', fontWeight: 'bold' }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    {profileOpen && (
                        <div className="notification-dropdown" style={{ width: '200px' }}>
                            <div className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { navigate('/settings'); setProfileOpen(false); }}>
                                <SettingsIcon size={16} className="text-muted" />
                                <span>Settings</span>
                            </div>
                            <div className="notification-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleLogout}>
                                <LogOut size={16} className="text-muted" />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
