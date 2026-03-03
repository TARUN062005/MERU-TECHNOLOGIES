const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.get('/:id', invoiceController.getInvoice);
router.post('/:id/lines', invoiceController.addLineItem);
router.post('/:id/payments', invoiceController.addPayment);
router.post('/:id/archive', invoiceController.archiveInvoice);
router.post('/:id/restore', invoiceController.restoreInvoice);

module.exports = router;
