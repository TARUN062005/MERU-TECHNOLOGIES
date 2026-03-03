const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/:id', invoiceController.getInvoice);
router.post('/:id/payments', invoiceController.addPayment);
router.post('/archive', invoiceController.archiveInvoice);
router.post('/restore', invoiceController.restoreInvoice);

module.exports = router;
