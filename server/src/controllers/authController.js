const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { generateRollNumber, generateVerificationToken } = require('../utils/generators');
const transporter = require('../config/email');
const { verificationEmail } = require('../utils/emailTemplates');

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
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const rollNumber = await generateRollNumber(prisma);

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
        dob: new Date(dob),
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
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email - Code i Technology',
        html: verificationEmail(verificationToken, username)
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email for verification.',
      student: { id: student.id, username: student.username }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const student = await prisma.student.findFirst({
      where: { verificationToken: token }
    });

    if (!student) {
      return res.status(400).json({ error: 'Invalid verification token' });
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

    // Check if user exists
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
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if student is verified
    if (user.hasOwnProperty('isVerified') && !user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email first' });
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
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    let user;
    
    if (req.session.userType === 'student') {
      user = await prisma.student.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          rollNumber: true,
          fullName: true,
          email: true,
          username: true,
          photoUrl: true
        }
      });
    } else {
      user = await prisma.admin.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          username: true
        }
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: { ...user, type: req.session.userType } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, verifyEmail, login, logout, getCurrentUser };