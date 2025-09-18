const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('adminpassword', 12);
  
  await prisma.admin.upsert({
    where: { email: 'admin@codeitech.com' },
    update: {},
    create: {
      fullName: 'Admin name',
      email: 'Adminemail',
      username: 'adminusername',
      password: hashedPassword
    }
  });

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