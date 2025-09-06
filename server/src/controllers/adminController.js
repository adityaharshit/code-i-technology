const prisma = require('../config/database');

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

module.exports = {
  getAllStudents,
  deleteStudent,
  getDashboardStats,
  getStudentDetails
};