// server/src/controllers/paymentController.js
const prisma = require('../config/database');
const { generateBillNumber } = require('../utils/generators');
const { uploadToCloudinary } = require('../services/uploadService');
const { generateInvoiceHTML } = require('../utils/invoiceUtils');


const createTransaction = async (req, res) => {
  try {
    const { courseId, months, modeOfPayment } = req.body;
    const studentId = parseInt(req.session.userId, 10);
    
    let paymentProofUrl = null;

    // Handle file upload from multer
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'payment-proofs');
      paymentProofUrl = result.secure_url;
    }
    
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    const amount = course.feePerMonth * parseInt(months);
    let discount = 0;
    
    // Apply discount only if paying for the full duration in one single transaction
    if (parseInt(months, 10) === course.duration) {
      discount = amount * (course.discountPercentage / 100);
    }
    
    const netPayable = amount - discount;
    const billNo = await generateBillNumber();
    
    const transaction = await prisma.transaction.create({
      data: {
        billNo,
        studentId: studentId,
        courseId: parseInt(courseId),
        months: parseInt(months),
        amount,
        discount,
        netPayable,
        modeOfPayment,
        paymentProofUrl // Save the Cloudinary URL
      },
      include: {
        course: true,
        student: true
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Transaction creation error:", error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

const getStudentTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { studentId: parseInt(req.session.userId, 10) },
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
    const { search, status } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { billNo: { contains: search, mode: 'insensitive' } },
        { modeOfPayment: { contains: search, mode: 'insensitive' } },
        {
          student: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { username: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { course: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    const transactions = await prisma.transaction.findMany({
      where,
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
    console.error('Error fetching all transactions:', error);
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
        const { generateInvoiceHTML } = require('../utils/invoiceUtils');
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
        
        const html = generateInvoiceHTML(transaction, transaction.student, transaction.course);
        res.header('Content-Type', 'text/html');
        res.send(html);
        
    } catch (error) {
        console.error(`Failed to get invoice for transaction ${req.params.id}`, error);
        res.status(500).json({ error: 'Failed to fetch invoice data' });
    }
};

const getLastTransactionForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = parseInt(req.session.userId, 10);

    const lastTransaction = await prisma.transaction.findFirst({
      where: {
        studentId: studentId,
        courseId: parseInt(courseId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(lastTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last transaction' });
  }
};

module.exports = {
  createTransaction,
  getStudentTransactions,
  getAllTransactions,
  updateTransactionStatus,
  getTransactionInvoice,
  getLastTransactionForCourse
};
