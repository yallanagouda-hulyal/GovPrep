const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =====================================================
   REGISTER USER
===================================================== */

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
    });

    res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
});

/* =====================================================
   LOGIN USER
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});

/* =====================================================
   ADMIN — GET ALL USERS
===================================================== */

router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json(users);
    } catch (error) {
      console.error("Fetch users error:", error.message);

      res.status(500).json({
        message: "Failed to fetch users.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN — UPDATE USER ROLE
===================================================== */

router.put(
  "/users/:id/role",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { role } = req.body;

      const allowedRoles = [
        "student",
        "instructor",
        "admin",
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message:
            "Invalid role. Allowed roles are student, instructor and admin.",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // Prevent admin from accidentally changing their own role
      if (user._id.toString() === req.user.id.toString()) {
        return res.status(400).json({
          message: "You cannot change your own role.",
        });
      }

      user.role = role;

      await user.save();

      res.status(200).json({
        message: "User role updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Update user role error:", error.message);

      res.status(500).json({
        message: "Failed to update user role.",
        error: error.message,
      });
    }
  }
);

/* =====================================================
   ADMIN — DELETE USER
===================================================== */

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // Prevent admin from deleting their own account
      if (user._id.toString() === req.user.id.toString()) {
        return res.status(400).json({
          message: "You cannot delete your own account.",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Delete user error:", error.message);

      res.status(500).json({
        message: "Failed to delete user.",
        error: error.message,
      });
    }
  }
);

module.exports = router;