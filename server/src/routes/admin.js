// /server/src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Admin dashboard stats
router.get('/dashboard', requireAdmin, adminController.getDashboardStats);
router.get('/recent-activity', requireAdmin, adminController.getRecentActivity);


// Student management
router.get('/students', requireAdmin, adminController.getAllStudents);
router.get('/students/:id/details', requireAdmin, adminController.getStudentDetails); 
router.get('/students/:id/id-card-info', requireAdmin, adminController.getStudentIdCardInfo);
router.delete('/students/:id', requireAdmin, adminController.deleteStudent);

// Manual Invoice Generation
router.post('/invoices/manual', requireAdmin, adminController.createManualTransactionAndInvoice);

// Certificate Management
router.post('/students/:studentId/courses/:courseId/certificate', requireAdmin, adminController.generateOrUpdateCertificate);
router.get('/students/:studentId/courses/:courseId/certificate-info', requireAdmin, adminController.getCertificateInfo);

//Marksheet Management
router.get('/students/:studentId/courses/:courseId/marksheet-info', requireAdmin, adminController.getMarksheetInfo);
router.post('/students/:studentId/courses/:courseId/marksheet', requireAdmin, adminController.generateOrUpdateMarksheet);


// Course management (handled in courses.js but protected here)
// Payment management (handled in payments.js but protected here)

module.exports = router;