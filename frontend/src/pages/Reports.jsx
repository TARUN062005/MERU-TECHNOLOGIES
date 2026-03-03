import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { getInvoices } from '../api/invoiceApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({ paid: 0, unpaid: 0 });

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Fetch all invoices to compute real-time metrics
                const invoices = await getInvoices({});

                let paidAmt = 0;
                let unpaidAmt = 0;

                invoices.forEach(inv => {
                    if (inv.status === 'PAID') {
                        paidAmt += inv.total;
                    } else {
                        unpaidAmt += (inv.balanceDue || inv.total);
                    }
                });

                setData({ paid: paidAmt, unpaid: unpaidAmt });
            } catch (err) {
                console.error("Failed to fetch reports", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    if (loading) return <Loader />;

    const barData = [
        { name: 'Revenue Overview', Paid: data.paid, Unpaid: data.unpaid }
    ];

    const pieData = [
        { name: 'Paid', value: data.paid },
        { name: 'Unpaid', value: data.unpaid }
    ];

    const COLORS = ['#059669', '#dc2626']; // success green, error red

    return (
        <div className="mt-20">
            <h1 className="section-title text-large m-0 mb-20">Reports & Analytics</h1>

            <div className="grid-2 dashboard-grid">
                <Card className="flex-align-center" style={{ flexDirection: 'column' }}>
                    <h3 className="section-title mb-20 text-center">Revenue Distribution</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex-align-center" style={{ flexDirection: 'column' }}>
                    <h3 className="section-title mb-20 text-center">Paid vs Unpaid Bar Chart</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'var(--bg-color)' }} formatter={(value) => `$${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="Paid" fill="#059669" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Unpaid" fill="#dc2626" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
