const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth, requireStudent } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { paymentLimiter } = require('../middleware/rateLimit');

// Student routes
router.post('/', requireAuth, requireStudent, paymentLimiter, upload.single('paymentProof'), validatePayment, paymentController.createTransaction);
router.get('/my-transactions', requireAuth, requireStudent, paymentController.getStudentTransactions);
router.get('/invoice/:id', requireAuth, paymentController.getTransactionInvoice);

// Admin routes
router.get('/',requireAuth, paymentController.getAllTransactions);
router.patch('/:id/status', requireAuth,paymentController.updateTransactionStatus);

module.exports = router;