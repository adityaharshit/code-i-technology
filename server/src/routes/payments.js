const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth, requireStudent } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');
const upload = require('../middleware/upload');
const { paymentLimiter } = require('../middleware/rateLimit');

// Student routes
router.post('/', requireAuth, requireStudent, paymentLimiter, upload.single('paymentProof'), validatePayment, paymentController.createPayment);
router.get('/student', requireAuth, requireStudent, paymentController.getStudentPayments);
router.get('/invoice/:id', requireAuth, requireStudent, paymentController.getInvoice);

// Admin routes
router.get('/', paymentController.getAllPayments);
router.put('/:id/approve', paymentController.approvePayment);
router.put('/:id/reject', paymentController.rejectPayment);

module.exports = router;