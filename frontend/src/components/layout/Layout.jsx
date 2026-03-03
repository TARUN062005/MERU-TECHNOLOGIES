import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationToast from '../notification/NotificationToast';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-wrapper">
            {isSidebarOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 15 }}
                />
            )}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="main-wrapper">
                <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="app-main">
                    <div className="page-container">
                        {children}
                    </div>
                </main>
            </div>
            <NotificationToast />
        </div>
    );
};

export default Layout;
