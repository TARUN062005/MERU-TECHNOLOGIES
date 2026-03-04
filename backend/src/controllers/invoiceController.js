const invoiceService = require('../services/invoiceService');

const createInvoice = async (req, res, next) => {
    try {
        const data = await invoiceService.createInvoice(req.body, req.user.id);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
};

const getAllInvoices = async (req, res, next) => {
    try {
        const data = await invoiceService.getAllInvoices(req.query, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const getInvoice = async (req, res, next) => {
    try {
        const data = await invoiceService.getInvoice(req.params.id, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const addLineItem = async (req, res, next) => {
    try {
        const data = await invoiceService.addLineItem(req.params.id, req.body, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const addPayment = async (req, res, next) => {
    try {
        const data = await invoiceService.addPayment(req.params.id, req.body.amount, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const archiveInvoice = async (req, res, next) => {
    try {
        const data = await invoiceService.archiveInvoice(req.params.id, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

const restoreInvoice = async (req, res, next) => {
    try {
        const data = await invoiceService.restoreInvoice(req.params.id, req.user.id);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoice,
    addLineItem,
    addPayment,
    archiveInvoice,
    restoreInvoice
};
