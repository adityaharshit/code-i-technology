// /server/src/controllers/courseController.js
const prisma = require('../config/database');
const { uploadToCloudinary } = require('../services/uploadService');

/**
 * Determines the status of a course based on its start date and duration.
 * @param {object} course - The course object from the database.
 * @returns {string} The calculated status ('live', 'upcoming', or 'completed').
 */
const getCourseStatus = (course) => {
  if (!course.startDate) {
    return 'upcoming';
  }
  const now = new Date();
  const startDate = new Date(course.startDate);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + course.duration);

  if (now < startDate) {
    return 'upcoming';
  } else if (now >= startDate && now <= endDate) {
    return 'live';
  } else {
    return 'completed';
  }
};


const getCourseDetailsForAdmin = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { search, status } = req.query; // Accept status from query

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: { student: { select: { id: true, fullName: true, rollNumber: true } } },
    });

    const transactionWhere = { courseId };
    if (search) {
      transactionWhere.OR = [
        { billNo: { contains: search, mode: 'insensitive' } },
        { modeOfPayment: { contains: search, mode: 'insensitive' } },
        {
          student: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    // Add status filter if it's provided and not 'all'
    if (status && status !== 'all') {
      transactionWhere.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where: transactionWhere,
      include: { student: { select: { id: true, fullName: true, rollNumber: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalStudents = enrollments.length;

    const revenueResult = await prisma.transaction.aggregate({
      _sum: { netPayable: true },
      where: { courseId, status: 'paid' },
    });
    const totalRevenue = revenueResult._sum.netPayable || 0;

    const enrolledStudents = await Promise.all(
      enrollments.map(async (enrollment) => {
        const paidTransactions = await prisma.transaction.findMany({
          where: { studentId: enrollment.studentId, courseId, status: 'paid' },
        });
        const monthsPaid = paidTransactions.reduce((sum, tx) => sum + tx.months, 0);
        return {
          ...enrollment.student,
          monthsPaid,
        };
      })
    );

    res.json({ course, totalStudents, totalRevenue, enrolledStudents, transactions });
  } catch (error) {
    console.error('Failed to get course details for admin:', error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    let courses = await prisma.course.findMany({
      orderBy: {
        startDate: 'desc', // Sort by start date
      },
    });

    const studentId = req.session.userId;

    if (studentId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: parseInt(studentId) },
        select: { courseId: true },
      });
      const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
      courses = courses.map(course => ({
        ...course,
        status: getCourseStatus(course),
        isEnrolled: enrolledCourseIds.has(course.id),
      }));
    } else {
      courses = courses.map(course => ({
        ...course,
        status: getCourseStatus(course),
        isEnrolled: false,
      }));
    }
    
    res.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const courseFromDb = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!courseFromDb) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    let courseWithDetails = {
      ...courseFromDb,
      status: getCourseStatus(courseFromDb),
      monthsPaid: 0,
      isEnrolled: false
    };

    // If a user is logged in, find out their enrollment and payment status
    if (req.session && req.session.userId) {
        const studentId = parseInt(req.session.userId, 10);
        const courseId = parseInt(req.params.id, 10);

        // Check for enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId, courseId } }
        });
        courseWithDetails.isEnrolled = !!enrollment;

        // Calculate months paid if enrolled
        if (courseWithDetails.isEnrolled) {
            const paidTransactions = await prisma.transaction.findMany({
                where: { studentId, courseId, status: 'paid' },
                select: { months: true }
            });
            courseWithDetails.monthsPaid = paidTransactions.reduce((acc, tx) => acc + tx.months, 0);
        }
    }
    
    res.json(courseWithDetails);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

const createCourse = async (req, res) => {
  try {
    const { 
        title, description, duration, startDate, feePerMonth, discountPercentage, 
        whatYouWillLearn, courseIncludes, skillLevel, language, instructorName, instructorDetails 
    } = req.body;

    let qrCodeUrl = req.body.qrCodeUrl || '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'course-qrcodes');
      qrCodeUrl = result.secure_url;
    }
    
    const course = await prisma.course.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        startDate: startDate ? new Date(startDate) : null,
        feePerMonth: parseFloat(feePerMonth),
        qrCodeUrl,
        discountPercentage: parseFloat(discountPercentage) || 0,
        whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : undefined,
        courseIncludes: courseIncludes ? JSON.parse(courseIncludes) : undefined,
        skillLevel,
        language,
        instructorName,
        instructorDetails,
      }
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { 
        title, description, duration, startDate, feePerMonth, discountPercentage,
        whatYouWillLearn, courseIncludes, skillLevel, language, instructorName, instructorDetails 
    } = req.body;

    let qrCodeUrl = req.body.qrCodeUrl || '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'course-qrcodes');
      qrCodeUrl = result.secure_url;
    }
    
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        duration: parseInt(duration),
        startDate: startDate ? new Date(startDate) : null,
        feePerMonth: parseFloat(feePerMonth),
        qrCodeUrl,
        discountPercentage: parseFloat(discountPercentage) || 0,
        whatYouWillLearn: whatYouWillLearn ? JSON.parse(whatYouWillLearn) : undefined,
        courseIncludes: courseIncludes ? JSON.parse(courseIncludes) : undefined,
        skillLevel,
        language,
        instructorName,
        instructorDetails,
      }
    });
    
    res.json(course);
  } catch (error) {
    console.error('Course update error:', error);
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
        studentId: parseInt(req.session.userId, 10),
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
    const studentId = parseInt(req.session.userId, 10);

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: { course: true }
    });

    if (!enrollments.length) {
      return res.json([]);
    }

    const paidTransactions = await prisma.transaction.findMany({
      where: { studentId, status: 'paid' },
      select: { courseId: true, months: true }
    });

    const monthsPaidMap = paidTransactions.reduce((acc, tx) => {
      acc[tx.courseId] = (acc[tx.courseId] || 0) + tx.months;
      return acc;
    }, {});

    const coursesWithDetails = enrollments.map(({ course }) => {
      const monthsPaid = monthsPaidMap[course.id] || 0;
      return {
        ...course,
        status: getCourseStatus(course),
        monthsPaid,
      };
    });

    res.json(coursesWithDetails);
  } catch (error) {
    console.error("Error fetching student courses:", error);
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
  getStudentCourses,
  getCourseDetailsForAdmin,
};
