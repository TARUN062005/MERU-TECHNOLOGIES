import { useState, useCallback, useEffect } from 'react';
import * as api from '../api/invoiceApi';

export const useInvoice = (id) => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInvoice = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getInvoiceById(id);
            setInvoice(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchInvoice();
    }, [id, fetchInvoice]);

    const addLineItem = async (data) => {
        const updated = await api.addLineItem(id, data);
        setInvoice(updated);
        return updated;
    };

    const addPayment = async (amount) => {
        const updated = await api.addPayment(id, amount);
        setInvoice(updated);
        return updated;
    };

    const archive = async () => {
        const updated = await api.archiveInvoice(id);
        setInvoice(updated);
        return updated;
    };

    const restore = async () => {
        const updated = await api.restoreInvoice(id);
        setInvoice(updated);
        return updated;
    };

    return { invoice, loading, error, refresh: fetchInvoice, addLineItem, addPayment, archive, restore };
};
