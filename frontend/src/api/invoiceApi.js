import axiosInstance from './axiosInstance';

export const getInvoiceById = async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
};

export const addPayment = async (id, amount) => {
    const response = await axiosInstance.post(`/invoices/${id}/payments`, { amount });
    return response.data;
};

export const archiveInvoice = async (invoiceId) => {
    const response = await axiosInstance.post('/invoices/archive', { invoiceId });
    return response.data;
};

export const restoreInvoice = async (invoiceId) => {
    const response = await axiosInstance.post('/invoices/restore', { invoiceId });
    return response.data;
};
