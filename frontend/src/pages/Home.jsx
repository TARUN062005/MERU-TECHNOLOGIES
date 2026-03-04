import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { BarChart2, Users, FileText, CheckCircle } from 'lucide-react';
import { getInvoices } from '../api/invoiceApi';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalInvoices: 0,
        paidInvoices: 0,
        activeClients: 0,
        pendingRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || !user.isVerified) {
                setLoading(false);
                return;
            }
            try {
                const invoices = await getInvoices({});
                const totalInvoices = invoices.length;
                const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;

                // Active clients - unique customer names
                const clients = new Set(invoices.map(inv => inv.customerName));

                // Pending revenue: sum of balanceDue for non-PAID invoices (assuming base USD for simplicity, or just total)
                let pendingRevenue = 0;
                invoices.forEach(inv => {
                    if (inv.status !== 'PAID') {
                        pendingRevenue += (inv.balanceDue || 0);
                    }
                });

                setStats({
                    totalInvoices,
                    paidInvoices,
                    activeClients: clients.size,
                    pendingRevenue
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    if (loading) return <Loader />;

    if (!user?.isVerified) {
        return (
            <div className="mt-20 fade-in text-center" style={{ padding: '60px 40px', background: 'var(--bg-lite)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h1 className="section-title text-large">Welcome, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-muted mt-20" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '20px auto' }}>Please check your inbox to verify your email address. You need to be verified to create and manage your invoices.</p>
                <Button onClick={() => navigate('/settings')} className="mt-20">Go to Settings to Verify</Button>
            </div>
        );
    }

    return (
        <div className="mt-20 fade-in">
            <h1 className="section-title mb-20 text-large">Welcome, {user?.name?.split(' ')[0]}!</h1>
            <div className="grid-2 dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <Card className="text-center p-40 flex-align-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <FileText size={32} className="text-primary" />
                    <div>Total Invoices</div>
                    <div className="text-strong text-large">{stats.totalInvoices}</div>
                </Card>
                <Card className="text-center p-40 flex-align-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <CheckCircle size={32} className="text-success" />
                    <div>Paid Invoices</div>
                    <div className="text-strong text-large">{stats.paidInvoices}</div>
                </Card>
                <Card className="text-center p-40 flex-align-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <Users size={32} className="text-warning" />
                    <div>Active Clients</div>
                    <div className="text-strong text-large">{stats.activeClients}</div>
                </Card>
                <Card className="text-center p-40 flex-align-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <BarChart2 size={32} className="text-pending" />
                    <div>Pending Revenue</div>
                    <div className="text-strong text-large">{formatCurrency(stats.pendingRevenue)}</div>
                </Card>
            </div>

            <div className="mt-20 flex-end">
                <Button onClick={() => navigate('/invoices/create')} className="btn-primary">Create New Invoice</Button>
            </div>
        </div>
    );
};

export default Home;
