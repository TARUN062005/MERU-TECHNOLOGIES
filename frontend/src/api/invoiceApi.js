import axiosInstance from './axiosInstance';

export const getInvoices = async (params) => {
    const response = await axiosInstance.get('/invoices', { params });
    return response.data;
};

export const createInvoice = async (data) => {
    const response = await axiosInstance.post('/invoices', data);
    return response.data;
};

export const getInvoiceById = async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
};

export const addLineItem = async (id, data) => {
    const response = await axiosInstance.post(`/invoices/${id}/lines`, data);
    return response.data;
};

export const addPayment = async (id, amount) => {
    const response = await axiosInstance.post(`/invoices/${id}/payments`, { amount });
    return response.data;
};

export const archiveInvoice = async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/archive`);
    return response.data;
};

export const restoreInvoice = async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/restore`);
    return response.data;
};

export const deleteInvoice = async (id) => {
    const response = await axiosInstance.delete(`/invoices/${id}`);
    return response.data;
};

export const sendInvoice = async (id) => {
    const response = await axiosInstance.post(`/invoices/${id}/send`);
    return response.data;
};
