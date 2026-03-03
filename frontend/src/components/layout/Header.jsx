import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import NotificationBell from '../notification/NotificationBell';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
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

            <div className="topbar-right">
                <NotificationBell />
                <div className="user-avatar">
                    <User size={20} />
                </div>
                <div className="brand-name-header" onClick={() => navigate('/')}>
                    FinDash
                </div>
            </div>
        </header>
    );
};

export default Header;
