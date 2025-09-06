const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { requireAuth, requireStudent } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Student routes
router.post('/enroll', requireAuth, requireStudent, courseController.enrollInCourse);
router.get('/my-courses', requireAuth, requireStudent, courseController.getStudentCourses);

// Admin routes (protected in admin controller)
router.post('/', upload.single('qrCode'), validateCourse, courseController.createCourse);
router.put('/:id', upload.single('qrCode'), validateCourse, courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;