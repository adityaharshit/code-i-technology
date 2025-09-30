// server/src/utils/generators.js
const prisma = require('../config/database');

const generateRollNumber = async (year) => {
  const currentYear = year || new Date().getFullYear();

  const sequence = await prisma.rollNumberSequence.upsert({
    where: { year: currentYear },
    update: { lastId: { increment: 1 } },
    create: { year: currentYear, lastId: 5001 },
  });

  return `${currentYear}CIT${sequence.lastId.toString().padStart(4, '0')}`;
};

const generateBillNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const sequenceId = `${year}-${month}`;

  const sequence = await prisma.billNumberSequence.upsert({
    where: { id: sequenceId },
    update: { lastId: { increment: 1 } },
    create: { id: sequenceId, lastId: 1 },
  });

  // Format: CIT/YYYY/MM/NNNN
  return `CIT/${year}/${month}/${sequence.lastId.toString().padStart(4, '0')}`;
};

const generateCertificateNumber = async () => {
    const sequence = await prisma.certificateNumberSequence.findUnique({
        where: { id: 1 }
    });
    const nextId = 10000000 + sequence.lastId;
    return `2021/CIT/${nextId.toString().substring(1)}`;
};

const generateVerificationToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

const calculatePayment = (feePerMonth, months, duration, discountPercentage = 0) => {
  const totalFee = feePerMonth * months;
  let discount = 0;
  
  if (months === duration) {
    discount = totalFee * (discountPercentage / 100);
  }
  
  const netPayable = totalFee - discount;
  
  return {
    amount: totalFee,
    discount,
    netPayable
  };
};

module.exports = {
  generateRollNumber,
  generateBillNumber,
  generateCertificateNumber,
  generateVerificationToken,
  calculatePayment
};