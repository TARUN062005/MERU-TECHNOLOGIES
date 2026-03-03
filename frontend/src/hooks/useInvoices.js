import { useState, useEffect, useCallback } from 'react';
import { getInvoiceById, addPayment } from '../api/invoiceApi';

export const useInvoiceDetails = (id) => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvoice = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getInvoiceById(id);
            setInvoice(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch invoice data');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchInvoice();
        else setLoading(false);
    }, [id, fetchInvoice]);

    const submitPayment = async (amount) => {
        try {
            await addPayment(id, amount);
            await fetchInvoice();
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Payment failed to process');
        }
    };

    return { invoice, loading, error, submitPayment, refresh: fetchInvoice };
};
