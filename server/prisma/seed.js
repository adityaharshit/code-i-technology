const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const seedCertificates = require('./certificateSeed');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // await prisma.admin.upsert({
  //   where: { email: 'admin@codeitech.com' },
  //   update: {},
  //   create: {
  //     fullName: 'Harshit Aditya',
  //     email: 'codeitechnology@gmail.com',
  //     username: 'admin',
  //     password: hashedPassword
  //   }
  // });

  await seedCertificates(prisma);
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });