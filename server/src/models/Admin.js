const prisma = require('../config/database');

class Admin {
  static async create(adminData) {
    return await prisma.admin.create({
      data: adminData
    });
  }

  static async findByEmail(email) {
    return await prisma.admin.findUnique({
      where: { email }
    });
  }

  static async findByUsername(username) {
    return await prisma.admin.findUnique({
      where: { username }
    });
  }

  static async findById(id) {
    return await prisma.admin.findUnique({
      where: { id: parseInt(id) }
    });
  }

  static async update(id, data) {
    return await prisma.admin.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async delete(id) {
    return await prisma.admin.delete({
      where: { id: parseInt(id) }
    });
  }

  static async getAll() {
    return await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        createdAt: true
      }
    });
  }
}

module.exports = Admin;