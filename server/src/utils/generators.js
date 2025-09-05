const generateRollNumber = (year, lastRollNumber) => {
  const currentYear = year || new Date().getFullYear();
  let sequenceNumber = 5001;
  
  if (lastRollNumber) {
    const lastSequence = parseInt(lastRollNumber.slice(-4));
    sequenceNumber = lastSequence + 1;
  }
  
  return `${currentYear}CIT${sequenceNumber.toString().padStart(4, '0')}`;
};

const generateBillNumber = (lastBillNumber) => {
  let sequenceNumber = 5001;
  
  if (lastBillNumber) {
    const lastSequence = parseInt(lastBillNumber.split('/')[1]);
    sequenceNumber = lastSequence + 1;
  }
  
  return `CIT/${sequenceNumber.toString().padStart(4, '0')}`;
};

const generateVerificationToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

const calculatePayment = (feePerMonth, months, duration, discountPercentage = 0) => {
  const totalFee = feePerMonth * months;
  let discount = 0;
  
  if (months === duration) {
    discount = feePerMonth * (discountPercentage / 100);
  }
  
  const netPayable = totalFee - discount;
  
  return {
    totalFee,
    discount,
    netPayable
  };
};

module.exports = {
  generateRollNumber,
  generateBillNumber,
  generateVerificationToken,
  calculatePayment
};