import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getInvoices } from '../api/invoiceApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { format } from 'date-fns';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const InvoicesList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentTab = searchParams.get('status') || 'All';
    const currentSearch = searchParams.get('search') || '';

    const tabs = ['All', 'Draft', 'Pending', 'Failed', 'Success'];

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch everything and filter logically on frontend to handle complex states
            const data = await getInvoices({
                status: 'All',
                search: currentSearch
            });

            const now = new Date();

            // Map true semantic statuses locally for the table
            const modeledData = data.map(inv => {
                let computedStatus = inv.status;
                if (inv.status === 'PAID') computedStatus = 'SUCCESS';
                else if (new Date(inv.dueDate) < now) computedStatus = 'FAILED';
                else computedStatus = (inv.balanceDue > 0 && inv.status !== 'DRAFT') ? 'PENDING' : 'DRAFT';
                // Assuming DRAFT remains DRAFT until sent (or partially paid). Unpaid = PENDING
                // For simplicity keeping the user's explicit filter bounds:
                if (inv.status !== 'PAID') {
                    if (new Date(inv.dueDate) < now) computedStatus = 'FAILED';
                    else if (inv.amountPaid > 0) computedStatus = 'PENDING';
                    else computedStatus = 'DRAFT';
                }

                // But user mentioned "when i click pending it should show all the unpaid invoices"
                return { ...inv, computedStatus };
            });

            let filtered = modeledData;

            if (currentTab === 'Pending') {
                filtered = modeledData.filter(inv => inv.balanceDue > 0 && inv.computedStatus !== 'FAILED');
            } else if (currentTab === 'Failed') {
                filtered = modeledData.filter(inv => inv.computedStatus === 'FAILED');
            } else if (currentTab === 'Success') {
                filtered = modeledData.filter(inv => inv.computedStatus === 'SUCCESS');
            } else if (currentTab === 'Draft') {
                filtered = modeledData.filter(inv => inv.computedStatus === 'DRAFT');
            }

            setInvoices(filtered);
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

    const handleDownload = () => {
        const doc = new jsPDF();

        doc.text(`Invoices Report (${currentTab})`, 14, 15);

        const tableColumn = ["Invoice #", "Client", "Issue Date", "Due Date", "Amount", "Status"];
        const tableRows = [];

        invoices.forEach(inv => {
            const invoiceData = [
                inv.invoiceNumber,
                inv.customerName,
                format(new Date(inv.issueDate), 'MMM dd, yyyy'),
                format(new Date(inv.dueDate), 'MMM dd, yyyy'),
                formatCurrency(inv.total, inv.currency),
                inv.computedStatus
            ];
            tableRows.push(invoiceData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [79, 70, 229] }
        });

        doc.save(`invoices_${currentTab.toLowerCase()}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    return (
        <div className="mt-20">
            <div className="flex-between mb-20" style={{ alignItems: 'center' }}>
                <div>
                    <h1 className="section-title text-large m-0">Invoices</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap' }}>
                    <Button variant="secondary" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                        <Download size={16} />
                        <span>Download List</span>
                    </Button>
                    <Button onClick={() => navigate('/invoices/create')} variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                        <span>+ Create Invoice</span>
                    </Button>
                </div>
            </div>

            <Card className="p-0 border-0">
                <div className="filter-tabs" style={{ padding: '1rem 1.5rem 0', marginBottom: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
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

                <div className="flex-between" style={{ padding: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="search-box" style={{ maxWidth: '350px' }}>
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search by invoice number or client..."
                            value={currentSearch}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}><input type="checkbox" className="custom-checkbox" /></th>
                                <th>Invoice Number</th>
                                <th>Client</th>
                                <th>Created Date</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center pt-10 pb-10">Loading...</td>
                                </tr>
                            ) : invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center pt-10 pb-10 text-muted">No invoices found.</td>
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
                                            <Badge status={inv.computedStatus} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="pagination flex-between" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                    <span className="text-muted text-small text-strong">Showing 1 to {invoices.length} of {invoices.length} entries</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="page-btn">Previous</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoicesList;
