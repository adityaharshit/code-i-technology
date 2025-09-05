const prisma = require('../config/database');

class Course {
  static async create(courseData) {
    return await prisma.course.create({
      data: courseData
    });
  }

  static async findById(id) {
    return await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                rollNumber: true,
                fullName: true,
                email: true
              }
            }
          }
        },
        transactions: true
      }
    });
  }

  static async findAll() {
    return await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findByStatus(status) {
    return await prisma.course.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(id, data) {
    return await prisma.course.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async delete(id) {
    return await prisma.course.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getEnrolledStudents(courseId) {
    return await prisma.enrollment.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true,
            studentMobile: true
          }
        }
      }
    });
  }

  static async getCourseTransactions(courseId) {
    return await prisma.transaction.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = Course;