// server/src/routes/courses.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { requireAuth, requireStudent, requireAdmin } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get('/', courseController.getAllCourses);

// Student routes (specific routes first)
router.get('/my-courses', requireAuth, requireStudent, courseController.getStudentCourses);
router.post('/enroll', requireAuth, requireStudent, courseController.enrollInCourse);

// Public route for specific course (must be after other specific GET routes)
router.get('/:id', courseController.getCourseById);

// Admin routes
router.post('/', requireAdmin, upload.single('qrCode'), validateCourse, courseController.createCourse);
router.put('/:id', requireAdmin, upload.single('qrCode'), validateCourse, courseController.updateCourse);
router.delete('/:id', requireAdmin, courseController.deleteCourse);


module.exports = router;
