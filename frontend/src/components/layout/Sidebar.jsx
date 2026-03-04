import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, FileText, BarChart2, Settings, HelpCircle, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const handleClose = () => {
        if (setIsOpen) setIsOpen(false);
    };

    return (
        <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-brand flex-between">
                <span>FinDash</span>
                <button
                    onClick={handleClose}
                    className="mobile-menu-btn"
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'none' }}
                >
                    <X size={24} />
                </button>
            </div>
            <nav className="sidebar-nav">
                <NavLink onClick={handleClose} to="/dashboard" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink onClick={handleClose} to="/transactions" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Receipt size={20} />
                    <span>Transactions</span>
                </NavLink>
                <NavLink onClick={handleClose} to="/invoices" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <FileText size={20} />
                    <span>Invoices</span>
                </NavLink>
                <NavLink onClick={handleClose} to="/reports" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <BarChart2 size={20} />
                    <span>Reports</span>
                </NavLink>
                <NavLink onClick={handleClose} to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <NavLink onClick={handleClose} to="/help" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <HelpCircle size={20} />
                    <span>Help Center</span>
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
