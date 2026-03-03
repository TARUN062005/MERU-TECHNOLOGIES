import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { BarChart2, Users, FileText, CheckCircle } from 'lucide-react';
import { getInvoices } from '../api/invoiceApi';

const Home = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalInvoices: 0,
        paidInvoices: 0,
        activeClients: 0,
        pendingRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
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
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    };

    if (loading) return <Loader />;

    return (
        <div className="mt-20">
            <h1 className="section-title mb-20 text-large">Dashboard</h1>
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
