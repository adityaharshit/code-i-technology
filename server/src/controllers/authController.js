const bcrypt = require("bcryptjs");
const prisma = require("../config/database");
const {
  generateRollNumber,
  generateVerificationToken,
} = require("../utils/generators");
const { sendVerificationEmail } = require("../services/emailService");

const register = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      email,
      username,
      password,
      studentMobile,
      parentMobile,
      occupation,
      dob,
      collegeName,
      bloodGroup,
      gender,
      qualification,
      permanentAddress,
      localAddress,
      photoUrl,
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.student.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email or username already exists" });
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
        verificationToken,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      fullName,
      verificationToken
    );
    if (!emailSent) {
      console.warn(
        `WARN: Failed to send verification email to ${email}, but user was created.`
      );
      // The registration is still successful, but we log the issue.
    }

    res.status(201).json({
      message:
        "Registration successful. Please check your email for verification.",
      student: { id: student.id, username: student.username },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during registration." });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const student = await prisma.student.findUnique({ where: { username } });
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (student || admin) {
      return res.json({ isAvailable: false });
    }

    return res.json({ isAvailable: true });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Server error while checking username" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const student = await prisma.student.findFirst({
      where: { verificationToken: token },
    });

    if (!student) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    await prisma.student.update({
      where: { id: student.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists (student or admin)
    const user =
      (await prisma.student.findFirst({
        where: {
          OR: [{ email: username }, { username }],
        },
      })) ||
      (await prisma.admin.findFirst({
        where: {
          OR: [{ email: username }, { username }],
        },
      }));

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if student is verified
    if (user.hasOwnProperty("isVerified") && !user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userType = user.hasOwnProperty("isVerified")
      ? "student"
      : "admin";

    // Return appropriate user data based on type
    let userData;
    if (req.session.userType === "student") {
      userData = {
        id: user.id,
        rollNumber: user.rollNumber,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        photoUrl: user.photoUrl,
        fatherName: user.fatherName,
        studentMobile: user.studentMobile,
        parentMobile: user.parentMobile,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        dob: user.dob,
        collegeName: user.collegeName,
        qualification: user.qualification,
        occupation: user.occupation,
        permanentAddress: user.permanentAddress,
        localAddress: user.localAddress,
        isVerified: user.isVerified,
        type: req.session.userType,
      };
    } else {
      userData = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        type: req.session.userType,
      };
    }

    res.json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // Ensure the session cookie is cleared
    res.status(200).json({ message: "Logout successful" });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId || !req.session.userType) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    let user;
    const userType = req.session.userType;

    if (userType === "student") {
      user = await prisma.student.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          rollNumber: true,
          fullName: true,
          email: true,
          username: true,
          photoUrl: true,
          fatherName: true,
          studentMobile: true,
          parentMobile: true,
          bloodGroup: true,
          gender: true,
          dob: true,
          collegeName: true,
          qualification: true,
          occupation: true,
          permanentAddress: true,
          localAddress: true,
          isVerified: true,
          createdAt: true,
        },
      });
    } else if (userType === "admin") {
      user = await prisma.admin.findUnique({
        where: { id: req.session.userId },
        select: {
          id: true,
          fullName: true,
          email: true,
          username: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      // If user not found, destroy the invalid session
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res
        .status(401)
        .json({ error: "User not found, session cleared." });
    }

    res.json({ user: { ...user, type: userType } });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  getCurrentUser,
  checkUsername,
};
