import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { CheckCircle, Zap, Shield, PieChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    // If already logged in, skip landing page and go to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="flex-between" style={{ padding: '1.5rem 5%', background: 'white', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} color="white" />
                    </div>
                    <h1 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 'bold' }}>FinDash</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" style={{ border: 'none' }}>Log In</Button>
                    </Link>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Button variant="primary">Get Started</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
                    Invoice Management Reimagined
                </div>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', maxWidth: '800px', lineHeight: 1.1, color: 'var(--text-main)' }}>
                    The Smart Way to Manage Your Business Invoices
                </h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    Simplify your billing, track your revenue in real-time, and get paid faster. Designed specifically for modern freelancers and growing teams.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '5rem' }}>
                    <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>Start for Free</Button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '12px' }}>Sign In</Button>
                    </Link>
                </div>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', width: '100%', textAlign: 'left' }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Shield size={24} className="text-primary" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 700 }}>Generate PDF Invoices</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Create beautiful, customizable invoices in seconds. Instantly download as a PDF document for your clients.</p>
                    </div>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <PieChart size={24} className="text-primary" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 700 }}>Real-time Analytics</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Track your paid and unpaid revenue with powerful, visual charting tools that update as your balance changes.</p>
                    </div>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <CheckCircle size={24} className="text-primary" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 700 }}>Flexible Archiving</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Not ready to send? Work on your invoices incrementally with stable drafting and secure historical archiving.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
