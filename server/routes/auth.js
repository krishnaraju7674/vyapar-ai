const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const auth = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "vyapar-secret-key-12345";

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await db.findUserByEmail(email);
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    user = await db.createUser(email, password);

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatch = await db.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const userId = user._id || user.id;
    const payload = { id: userId };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: userId, email: user.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/auth/me
// @desc    Get user by token
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/forgot-password
// @desc    Generate password reset token
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(400).json({ error: "No account with that email" });

    const token = await db.generateResetToken(email);
    const resetUrl = `${req.headers.origin || "http://localhost:5180"}/reset-password/${token}`;

    console.log(`\n[Vyapar AI] Password reset link for ${email}:`);
    console.log(`[Vyapar AI] ${resetUrl}\n`);

    res.json({
      success: true,
      message: "Reset link generated. Check server console or use the dev token below.",
      resetUrl: resetUrl,
    });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await db.findUserByResetToken(req.params.token);
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    await db.updatePassword(user, password);
    res.json({ success: true, message: "Password has been reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
