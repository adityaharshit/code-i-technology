const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateRollNumber, generateVerificationToken } = require('../utils/generators');
const { sendVerificationEmail } = require('../services/emailService');

const register = async (req, res) => {
  try {
    const {
      fullName, fatherName, email, username, password,
      studentMobile, parentMobile, occupation, dob,
      collegeName, bloodGroup, gender, qualification,
      permanentAddress, localAddress, photoUrl
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const rollNumber = await generateRollNumber();

    // Create student
    const student = await prisma.student.create({
      data: {
        rollNumber,
        fullName,
        fatherName,
        email,
        username,
        password: hashedPassword,
        studentMobile,
        parentMobile,
        occupation,
        dob: dob ? new Date(dob) : null,
        collegeName,
        bloodGroup,
        gender,
        qualification,
        permanentAddress,
        localAddress,
        photoUrl,
        verificationToken
      }
    });

    // Send verification email
    await sendVerificationEmail(email, fullName, verificationToken);

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification.',
      student: { id: student.id, username: student.username }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};


const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const student = await prisma.student.findUnique({ where: { username } });
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (student || admin) {
      return res.json({ isAvailable: false });
    }

    return res.json({ isAvailable: true });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'Server error while checking username' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const student = await prisma.student.findFirst({
      where: { verificationToken: token }
    });

    if (!student) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    await prisma.student.update({
      where: { id: student.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists (student or admin)
    const user = await prisma.student.findFirst({
      where: {
        OR: [{ email: username }, { username }]
      }
    }) || await prisma.admin.findFirst({
      where: {
        OR: [{ email: username }, { username }]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if student is verified
    if (user.hasOwnProperty('isVerified') && !user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userType = user.hasOwnProperty('isVerified') ? 'student' : 'admin';

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        type: req.session.userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Ensure the session cookie is cleared
    res.status(200).json({ message: 'Logout successful' });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId || !req.session.userType) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let user;
    const userType = req.session.userType;
    
    if (userType === 'student') {
      user = await prisma.student.findUnique({
        where: { id: req.session.userId },
        select: { id: true, fullName: true, email: true, username: true }
      });
    } else if (userType === 'admin') {
      user = await prisma.admin.findUnique({
        where: { id: req.session.userId },
        select: { id: true, fullName: true, email: true, username: true }
      });
    }

    if (!user) {
      // If user not found, destroy the invalid session
      req.session.destroy();
      res.clearCookie('connect.sid');
      return res.status(401).json({ error: 'User not found, session cleared.' });
    }

    res.json({ user: { ...user, type: userType } });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { register, verifyEmail, login, logout, getCurrentUser, checkUsername };
