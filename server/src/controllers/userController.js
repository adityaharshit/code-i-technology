const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateRollNumber, generateVerificationToken } = require('../utils/generators');
const { sendVerificationEmail } = require('../services/emailService');

// Helper function to determine course status
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

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.student.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      fatherName,
      studentMobile,
      parentMobile,
      occupation,
      collegeName,
      bloodGroup,
      qualification,
      permanentAddress,
      localAddress,
      photoUrl
    } = req.body;

    const updatedUser = await prisma.student.update({
      where: { id: req.session.userId },
      data: {
        fatherName,
        studentMobile,
        parentMobile,
        occupation,
        collegeName,
        bloodGroup,
        qualification,
        permanentAddress,
        localAddress,
        photoUrl
      },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { id: req.session.userId }
    });

    if (!admin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const user = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true,
        createdAt: true,
        enrollments: {
          include: {
            course: true
          }
        },
        transactions: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Get dashboard stats for the logged-in student
const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.session.userId;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
        transactions: {
          where: { status: 'paid' },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { enrollments, transactions } = student;

    const coursesRegistered = enrollments.length;
    const coursesCompleted = enrollments.filter(e => getCourseStatus(e.course) === 'completed').length;
    const ongoingCourses = enrollments.filter(e => getCourseStatus(e.course) === 'live').length;
    const feesPaid = transactions.reduce((sum, tx) => sum + tx.netPayable, 0);

    const totalTransactions = await prisma.transaction.count({ where: { studentId }});

    const monthsPaidMap = transactions.reduce((acc, tx) => {
        acc[tx.courseId] = (acc[tx.courseId] || 0) + tx.months;
        return acc;
    }, {});
    
    const pendingPaymentsCount = enrollments.filter(e => {
        const courseStatus = getCourseStatus(e.course);
        if (courseStatus === 'completed') return false;
        const paidMonths = monthsPaidMap[e.course.id] || 0;
        return paidMonths < e.course.duration;
    }).length;

    const profileFields = [
      'fatherName', 'studentMobile', 'parentMobile', 'occupation', 'dob',
      'collegeName', 'bloodGroup', 'gender', 'qualification', 'photoUrl'
    ];
    const filledFields = profileFields.filter(field => student[field]).length;
    const totalFields = profileFields.length;
    const profileCompletion = Math.round((filledFields / totalFields) * 100);

    res.json({
      coursesRegistered,
      coursesCompleted,
      ongoingCourses,
      feesPaid,
      totalTransactions,
      pendingPayments: pendingPaymentsCount,
      profileCompletion
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  getDashboardStats,
};

