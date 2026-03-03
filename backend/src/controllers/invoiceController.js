const invoiceService = require('../services/invoiceService');

const getInvoice = async (req, res) => {
    try {
        const data = await invoiceService.getInvoiceDetails(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const addPayment = async (req, res) => {
    try {
        const data = await invoiceService.addPayment(req.params.id, req.body.amount);
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const archiveInvoice = async (req, res) => {
    try {
        const id = req.body.invoiceId || req.params.id;
        const data = await invoiceService.archiveInvoice(id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const restoreInvoice = async (req, res) => {
    try {
        const id = req.body.invoiceId || req.params.id;
        const data = await invoiceService.restoreInvoice(id);
        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getInvoice,
    addPayment,
    archiveInvoice,
    restoreInvoice
};
