const prisma = require('../config/database');

class Enrollment {
  static async create(enrollmentData) {
    return await prisma.enrollment.create({
      data: enrollmentData,
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true
          }
        }
      }
    });
  }

  static async findByStudentAndCourse(studentId, courseId) {
    return await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: parseInt(studentId),
          courseId: parseInt(courseId)
        }
      }
    });
  }

  static async findByStudentId(studentId) {
    return await prisma.enrollment.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        course: true
      },
      orderBy: { enrolledAt: 'desc' }
    });
  }

  static async findByCourseId(courseId) {
    return await prisma.enrollment.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });
  }

  static async delete(studentId, courseId) {
    return await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId: parseInt(studentId),
          courseId: parseInt(courseId)
        }
      }
    });
  }

  static async countByCourse(courseId) {
    return await prisma.enrollment.count({
      where: { courseId: parseInt(courseId) }
    });
  }
}

module.exports = Enrollment;