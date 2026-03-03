import { useState } from 'react';
import * as api from '../api/invoiceApi';

export const useCreateInvoice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const create = async (invoiceData) => {
        try {
            setLoading(true);
            setError(null);
            const newInvoice = await api.createInvoice(invoiceData);
            return newInvoice;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};
