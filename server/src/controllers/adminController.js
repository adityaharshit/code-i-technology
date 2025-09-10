// /server/src/controllers/adminController.js
const prisma = require('../config/database');
const { generateBillNumber } = require('../utils/generators');
const { generateInvoiceHTML } = require('../utils/invoiceUtils');

const getStudentDetails = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true, rollNumber: true, fullName: true, photoUrl: true, fatherName: true, email: true, username: true, studentMobile: true, parentMobile: true, occupation: true, dob: true, collegeName: true, bloodGroup: true, gender: true, qualification: true, permanentAddress: true, localAddress: true, isVerified: true, createdAt: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: studentId },
      include: { course: { select: { id: true, title: true, duration: true } } }
    });

    const enrollmentsWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
      const paidTransactions = await prisma.transaction.findMany({
        where: { studentId: studentId, courseId: enrollment.courseId, status: 'paid' }
      });
      const monthsPaid = paidTransactions.reduce((sum, tx) => sum + tx.months, 0);
      return {
        courseTitle: enrollment.course.title,
        courseDuration: enrollment.course.duration,
        monthsPaid: monthsPaid
      };
    }));

    res.json({ ...student, enrollments: enrollmentsWithProgress });

  } catch (error) {
    console.error('Failed to get student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { search } = req.query;
    const whereCondition = {};

    if (search) {
      whereCondition.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
        { rollNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.student.findMany({
      where: whereCondition,
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        username: true,
        isVerified: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCourses,
      totalTransactions,
      totalRevenue
    ] = await Promise.all([
      prisma.student.count(),
      prisma.course.count(),
      prisma.transaction.count(),
      prisma.transaction.aggregate({
        _sum: { netPayable: true },
        where: { status: 'paid' }
      })
    ]);
    
    res.json({
      totalStudents,
      totalCourses,
      totalTransactions,
      totalRevenue: totalRevenue._sum.netPayable || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

const createManualTransactionAndInvoice = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentMobile,
      studentAddress,
      courseName,
      courseFee,
      discount,
      netPayable,
      modeOfPayment,
      amountPaid
    } = req.body;

    // Generate a new bill number for this invoice
    const billNo = await generateBillNumber();

    // Construct mock objects for the invoice generator utility
    const mockStudent = {
      rollNumber: studentId,
      fullName: studentName,
      studentMobile: studentMobile,
      localAddress: { street: studentAddress } // Structure to match formatAddress utility
    };

    const mockCourse = {
      title: courseName
    };

    const mockTransaction = {
      billNo,
      createdAt: new Date(),
      months: 1, // Default to 1 for manual entry since it's not specified
      amount: parseFloat(courseFee),
      discount: parseFloat(discount),
      netPayable: parseFloat(netPayable),
      modeOfPayment,
      status: 'paid'
    };

    const invoiceHTML = generateInvoiceHTML(mockTransaction, mockStudent, mockCourse);

    res.header('Content-Type', 'text/html').send(invoiceHTML);

  } catch (error) {
    console.error('Manual invoice generation error:', error);
    res.status(500).json({ error: 'Failed to generate manual invoice.' });
  }
};

module.exports = {
  getAllStudents,
  deleteStudent,
  getDashboardStats,
  getStudentDetails,
  createManualTransactionAndInvoice,
};


const getStudentIdCardInfo = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          orderBy: {
            enrolledAt: 'desc',
          },
          take: 1,
          include: {
            course: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let expiryDate = new Date(student.createdAt);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    let course = { title: 'General Studies', duration: 12, startDate: student.createdAt }; // Default course

    if (student.enrollments.length > 0) {
      const latestEnrollment = student.enrollments[0];
      expiryDate = new Date(latestEnrollment.enrolledAt);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      course = latestEnrollment.course;
    }

    const expiryDateString = expiryDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).replace(' ', ' ');

    res.json({
      user: {
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        photoUrl: student.photoUrl,
        gender: student.gender,
        studentMobile: student.studentMobile,
        parentMobile: student.parentMobile,
        bloodGroup: student.bloodGroup,
        dob: student.dob,
      },
      course: { // Course is needed for QR code data
        title: course.title,
        duration: course.duration,
        startDate: course.startDate
      },
      expiryDate: expiryDateString,
    });
  } catch (error) {
    console.error('Failed to get student ID card info:', error);
    res.status(500).json({ error: 'Failed to fetch student data for ID card' });
  }
};



const getRecentActivity = async (req, res) => {
  try {
    const recentRegistrations = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { fullName: true, createdAt: true },
    });

    const recentPayments = await prisma.transaction.findMany({
      where: { status: 'paid' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { student: { select: { fullName: true } } },
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      take: 5,
      include: {
        student: { select: { fullName: true } },
        course: { select: { title: true } },
      },
    });

    const activities = [
      ...recentRegistrations.map(s => ({
        type: 'New Student Registration',
        details: s.fullName,
        timestamp: s.createdAt,
        icon: '🎓',
      })),
      ...recentPayments.map(p => ({
        type: 'Payment Received',
        details: `from ${p.student.fullName}`,
        timestamp: p.createdAt,
        icon: '💰',
      })),
      ...recentEnrollments.map(e => ({
        type: 'Course Enrollment',
        details: `${e.student.fullName} in ${e.course.title}`,
        timestamp: e.enrolledAt,
        icon: '📊',
      })),
    ];

    // Sort all activities by timestamp and take the most recent 5
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    res.json(sortedActivities);
  } catch (error) {
    console.error('Failed to get recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};


module.exports = {
  getAllStudents,
  deleteStudent,
  getDashboardStats,
  getStudentDetails,
  createManualTransactionAndInvoice,
  getRecentActivity,
  getStudentIdCardInfo
};

