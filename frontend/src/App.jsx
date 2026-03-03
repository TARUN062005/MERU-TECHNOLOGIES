import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceDetail from './pages/InvoiceDetail';
import EmptyState from './components/common/EmptyState';
import './styles/index.css';

const App = () => {
    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <header className="app-topbar">
                    <div className="logo">FinDash</div>
                </header>
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Navigate to="/invoices/65d1c25a58eeb29aa189be32" replace />} />
                        <Route path="/invoices/example-id" element={<Navigate to="/invoices/65d1c25a58eeb29aa189be32" replace />} />
                        <Route path="/invoices/:id" element={<InvoiceDetail />} />
                        <Route path="*" element={<div className="page-center"><EmptyState message="Please specify a valid invoice URL" /></div>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
