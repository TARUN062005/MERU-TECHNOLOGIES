import React from 'react';
import Header from './Header';
import NotificationToast from '../notification/NotificationToast';

const Layout = ({ children }) => {
    return (
        <div className="app-wrapper">
            <Header />
            <NotificationToast />
            <main className="app-main">
                <div className="page-container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
