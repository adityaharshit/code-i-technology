const prisma = require('../config/database');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.student.findUnique({
      where: { id: req.session.userId },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      fatherName,
      studentMobile,
      parentMobile,
      occupation,
      collegeName,
      bloodGroup,
      qualification,
      permanentAddress,
      localAddress
    } = req.body;

    const updatedUser = await prisma.student.update({
      where: { id: req.session.userId },
      data: {
        fatherName,
        studentMobile,
        parentMobile,
        occupation,
        collegeName,
        bloodGroup,
        qualification,
        permanentAddress,
        localAddress
      },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    // Check if user is admin
    const admin = await prisma.admin.findUnique({
      where: { id: req.session.userId }
    });

    if (!admin) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const user = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        fatherName: true,
        email: true,
        username: true,
        studentMobile: true,
        parentMobile: true,
        occupation: true,
        dob: true,
        collegeName: true,
        bloodGroup: true,
        gender: true,
        qualification: true,
        permanentAddress: true,
        localAddress: true,
        isVerified: true,
        createdAt: true,
        enrollments: {
          include: {
            course: true
          }
        },
        transactions: {
          include: {
            course: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById
};