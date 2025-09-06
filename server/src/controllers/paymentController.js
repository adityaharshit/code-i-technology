const prisma = require('../config/database');
const { generateBillNumber } = require('../utils/generators');

const createTransaction = async (req, res) => {
  try {
    const { courseId, months, modeOfPayment, paymentProofUrl } = req.body;
    
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const amount = course.feePerMonth * parseInt(months);
    let discount = 0;
    
    // Apply discount if paying for full duration
    if (parseInt(months) === course.duration) {
      discount = amount * (process.env.DISCOUNT_PERCENTAGE / 100);
    }
    
    const netPayable = amount - discount;
    const billNo = generateBillNumber();
    
    const transaction = await prisma.transaction.create({
      data: {
        billNo,
        studentId: req.session.userId,
        courseId: parseInt(courseId),
        months: parseInt(months),
        amount,
        discount,
        netPayable,
        modeOfPayment,
        paymentProofUrl
      },
      include: {
        course: true,
        student: true
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

const getStudentTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { studentId: req.session.userId },
      include: {
        course: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
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
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const transaction = await prisma.transaction.update({
      where: { tid: parseInt(req.params.id) },
      data: { status }
    });
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

const getTransactionInvoice = async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { tid: parseInt(req.params.id) },
      include: {
        course: true,
        student: true
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice data' });
  }
};

module.exports = {
  createTransaction,
  getStudentTransactions,
  getAllTransactions,
  updateTransactionStatus,
  getTransactionInvoice
};