const prisma = require('../config/database');

const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, duration, startDate, feePerMonth, qrCodeUrl, status } = req.body;
    
    const course = await prisma.course.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        startDate: startDate ? new Date(startDate) : null,
        feePerMonth: parseFloat(feePerMonth),
        qrCodeUrl,
        status
      }
    });
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, duration, startDate, feePerMonth, qrCodeUrl, status } = req.body;
    
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        duration: parseInt(duration),
        startDate: startDate ? new Date(startDate) : null,
        feePerMonth: parseFloat(feePerMonth),
        qrCodeUrl,
        status
      }
    });
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.session.userId,
        courseId: parseInt(courseId)
      },
      include: {
        course: true
      }
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.session.userId },
      include: {
        course: true
      }
    });
    
    res.json(enrollments.map(enrollment => enrollment.course));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student courses' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getStudentCourses
};