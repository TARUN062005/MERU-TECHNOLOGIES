import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import InvoicesList from './pages/InvoicesList';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import EmptyState from './components/common/EmptyState';
import './styles/index.css';

const App = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotificationProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/invoices" element={<InvoicesList />} />
                        <Route path="/invoices/create" element={<CreateInvoice />} />
                        <Route path="/invoices/:id" element={<InvoiceDetail />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="*" element={<EmptyState message="Page Not Found" />} />
                    </Routes>
                </Layout>
            </NotificationProvider>
        </BrowserRouter>
    );
};

export default App;
