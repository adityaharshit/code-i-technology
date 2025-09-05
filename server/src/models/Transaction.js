const prisma = require('../config/database');

class Transaction {
  static async create(transactionData) {
    return await prisma.transaction.create({
      data: transactionData,
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true
          }
        }
      }
    });
  }

  static async findById(tid) {
    return await prisma.transaction.findUnique({
      where: { tid: parseInt(tid) },
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true,
            studentMobile: true,
            permanentAddress: true,
            localAddress: true
          }
        }
      }
    });
  }

  static async findByBillNo(billNo) {
    return await prisma.transaction.findUnique({
      where: { billNo },
      include: {
        course: true,
        student: true
      }
    });
  }

  static async findByStudentId(studentId) {
    return await prisma.transaction.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        course: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async findAll() {
    return await prisma.transaction.findMany({
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async update(tid, data) {
    return await prisma.transaction.update({
      where: { tid: parseInt(tid) },
      data
    });
  }

  static async delete(tid) {
    return await prisma.transaction.delete({
      where: { tid: parseInt(tid) }
    });
  }

  static async getPendingApprovals() {
    return await prisma.transaction.findMany({
      where: { status: 'pending approval' },
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getByStatus(status) {
    return await prisma.transaction.findMany({
      where: { status },
      include: {
        course: true,
        student: {
          select: {
            id: true,
            rollNumber: true,
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = Transaction;