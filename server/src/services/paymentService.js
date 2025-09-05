const prisma = require('../config/database');
const { calculatePayment } = require('../utils/generators');
const { DISCOUNT_PERCENTAGE } = require('../utils/constants');

const processPayment = async (studentId, courseId, months, modeOfPayment, paymentProofUrl = null) => {
  try {
    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Check if student is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });
    
    if (!enrollment) {
      throw new Error('Student is not enrolled in this course');
    }
    
    // Calculate payment details
    const paymentDetails = calculatePayment(
      course.feePerMonth, 
      months, 
      course.duration, 
      months === course.duration ? DISCOUNT_PERCENTAGE : 0
    );
    
    // Get the last bill number to generate the next one
    const lastTransaction = await prisma.transaction.findFirst({
      orderBy: { tid: 'desc' }
    });
    
    const { generateBillNumber } = require('../utils/generators');
    const billNo = generateBillNumber(lastTransaction ? lastTransaction.billNo : null);
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        billNo,
        studentId,
        courseId,
        months,
        amount: paymentDetails.totalFee,
        discount: paymentDetails.discount,
        netPayable: paymentDetails.netPayable,
        modeOfPayment,
        paymentProofUrl,
        status: modeOfPayment === 'offline' ? 'pending approval' : 'pending approval'
      }
    });
    
    return transaction;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  processPayment
};