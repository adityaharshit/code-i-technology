const prisma = require('../config/database');

class Student {
  static async create(studentData) {
    return await prisma.student.create({
      data: studentData
    });
  }

  static async findByEmail(email) {
    return await prisma.student.findUnique({
      where: { email }
    });
  }

  static async findByUsername(username) {
    return await prisma.student.findUnique({
      where: { username }
    });
  }

  static async findById(id) {
    return await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
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
  }

  static async findByVerificationToken(token) {
    return await prisma.student.findFirst({
      where: { verificationToken: token }
    });
  }

  static async update(id, data) {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async delete(id) {
    return await prisma.student.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getAll() {
    return await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
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
      }
    });
  }

  static async verifyEmail(id) {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });
  }
}

module.exports = Student;