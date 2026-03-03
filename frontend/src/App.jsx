import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import InvoicesList from './pages/InvoicesList';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import Reports from './pages/Reports';
import Transactions from './pages/Transactions';
import EmptyState from './components/common/EmptyState';
import './styles/index.css';

import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotificationProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
                        <Route path="/invoices" element={<ProtectedRoute><Layout><InvoicesList /></Layout></ProtectedRoute>} />
                        <Route path="/invoices/create" element={<ProtectedRoute><Layout><CreateInvoice /></Layout></ProtectedRoute>} />
                        <Route path="/invoices/:id" element={<ProtectedRoute><Layout><InvoiceDetail /></Layout></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
                        <Route path="/transactions" element={<ProtectedRoute><Layout><Transactions /></Layout></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                        <Route path="/help" element={<ProtectedRoute><Layout><HelpCenter /></Layout></ProtectedRoute>} />
                        <Route path="*" element={<Layout><EmptyState message="Page Not Found" /></Layout>} />
                    </Routes>
                </AuthProvider>
            </NotificationProvider>
        </BrowserRouter>
    );
};

export default App;
