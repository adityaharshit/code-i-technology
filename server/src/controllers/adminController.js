const prisma = require('../config/database');

const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        email: true,
        username: true,
        studentMobile: true,
        collegeName: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(students);
  } catch (error) {
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
  getDashboardStats
};