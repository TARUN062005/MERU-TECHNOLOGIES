import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getInvoices } from '../api/invoiceApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { format } from 'date-fns';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';

const InvoicesList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentTab = searchParams.get('status') || 'All';
    const currentSearch = searchParams.get('search') || '';

    const tabs = ['All', 'Draft', 'Unpaid', 'Pending', 'Failed', 'Success'];

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInvoices({
                status: currentTab,
                search: currentSearch
            });
            setInvoices(data);
        } catch (err) {
            console.error('Failed to fetch invoices', err);
        } finally {
            setLoading(false);
        }
    }, [currentTab, currentSearch]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleTabChange = (tab) => {
        searchParams.set('status', tab);
        setSearchParams(searchParams);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        if (val) {
            searchParams.set('search', val);
        } else {
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
    };

    return (
        <div className="mt-20">
            <div className="flex-between mb-20">
                <div>
                    <h1 className="section-title text-large m-0">Invoices</h1>
                </div>
                <div className="flex-align-center gap-10">
                    <Button variant="secondary"><Download size={16} /> Download</Button>
                    <Button onClick={() => navigate('/invoices/create')} variant="primary">Create Invoice</Button>
                </div>
            </div>

            <Card className="p-0">
                <div className="filter-tabs" style={{ padding: '1rem 1.5rem 0', marginBottom: 0 }}>
                    {tabs.map(tab => (
                        <div
                            key={tab}
                            className={`filter-tab ${currentTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                <div className="flex-between" style={{ padding: '1.5rem' }}>
                    <div className="search-box">
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search by invoice number or client..."
                            value={currentSearch}
                            onChange={handleSearch}
                        />
                    </div>
                    <div>
                        <Button variant="secondary"><Filter size={16} /> Filter</Button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" className="custom-checkbox" /></th>
                                <th>Invoice Number</th>
                                <th>Client</th>
                                <th>Created Date</th>
                                <th>Amount</th>
                                <th>Last Updated</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center pt-10 pb-10">Loading...</td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center pt-10 pb-10 text-muted">No invoices found</td>
                                </tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr key={inv._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/invoices/${inv._id}`)}>
                                        <td onClick={e => e.stopPropagation()}><input type="checkbox" className="custom-checkbox" /></td>
                                        <td className="text-strong">{inv.invoiceNumber}</td>
                                        <td>{inv.customerName}</td>
                                        <td>{format(new Date(inv.issueDate), 'MMM dd, yyyy')}</td>
                                        <td className="text-strong">{formatCurrency(inv.total, inv.currency)}</td>
                                        <td>{format(new Date(inv.dueDate), 'MMM dd, yyyy')}</td>
                                        <td>
                                            <Badge status={inv.status} />
                                        </td>
                                        <td className="text-right" onClick={e => e.stopPropagation()}>
                                            <MoreVertical size={18} className="text-muted" style={{ cursor: 'pointer' }} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination" style={{ padding: '1.5rem' }}>
                    <span className="text-muted mr-10" style={{ marginRight: 'auto', fontSize: '0.85rem' }}>Showing 1 to {invoices.length} of {invoices.length} entries</span>
                    <button className="page-btn">Previous</button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">Next</button>
                </div>
            </Card>
        </div>
    );
};

export default InvoicesList;
