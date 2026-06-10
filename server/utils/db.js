const mongoose = require("mongoose");
const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcryptjs");

const usersMemory = [];
const sessionsMemory = [];

const db = {
  isDbConnected() {
    return mongoose.connection.readyState === 1;
  },

  async findUserByEmail(email) {
    if (this.isDbConnected()) {
      return User.findOne({ email });
    }
    return usersMemory.find(u => u.email === email.toLowerCase());
  },

  async createUser(email, password) {
    if (this.isDbConnected()) {
      const user = new User({ email, password });
      await user.save();
      return { id: user._id, email: user.email };
    }
    // Hash password for in-memory security parity
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {
      _id: Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date()
    };
    usersMemory.push(user);
    return { id: user._id, email: user.email };
  },

  async verifyPassword(user, password) {
    if (this.isDbConnected()) {
      return user.comparePassword(password);
    }
    return bcrypt.compare(password, user.password);
  },

  async findUserById(id) {
    if (this.isDbConnected()) {
      return User.findById(id).select("-password");
    }
    const user = usersMemory.find(u => u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async generateResetToken(email) {
    if (this.isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user) return null;
      const token = user.generateResetToken();
      await user.save();
      return token;
    }
    const user = usersMemory.find(u => u.email === email.toLowerCase());
    if (!user) return null;
    const token = require("crypto").randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    return token;
  },

  async findUserByResetToken(token) {
    if (this.isDbConnected()) {
      return User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }
    return usersMemory.find(u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now()) || null;
  },

  async updatePassword(user, newPassword) {
    if (this.isDbConnected()) {
      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return true;
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    return true;
  },

  async createSession(idea, category, result, userId) {
    const aiWelcome = `Namaste! I am your Vyapar AI Advisor. I have analyzed your idea for "${idea}" in "${category}". Your score is ${result.scores.indiaFit}/100 for Indian Market Fit. Feel free to ask me follow-up questions about this project!`;
    
    if (this.isDbConnected()) {
      const sessionData = {
        idea,
        category,
        result,
        chatHistory: [{ sender: "ai", message: aiWelcome }]
      };
      if (userId) sessionData.user = userId;
      const session = new Session(sessionData);
      await session.save();
      return session;
    }
    
    const session = {
      _id: Math.random().toString(36).substring(2, 9),
      idea,
      category,
      result,
      user: userId || null,
      chatHistory: [{ sender: "ai", message: aiWelcome }],
      createdAt: new Date()
    };
    sessionsMemory.push(session);
    return session;
  },

  async findSessionsByUser(userId) {
    if (this.isDbConnected()) {
      return Session.find({ user: userId })
        .select("idea category result.verdict result.scores.indiaFit createdAt")
        .sort({ createdAt: -1 });
    }
    return sessionsMemory
      .filter(s => s.user === userId)
      .map(s => ({
        _id: s._id,
        idea: s.idea,
        category: s.category,
        result: {
          verdict: s.result.verdict,
          scores: { indiaFit: s.result.scores.indiaFit }
        },
        createdAt: s.createdAt
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async findSessionById(id) {
    if (this.isDbConnected()) {
      return Session.findById(id);
    }
    return sessionsMemory.find(s => s._id === id) || null;
  },

  async addChatMessage(sessionId, sender, message, replyText) {
    if (this.isDbConnected()) {
      const session = await Session.findById(sessionId);
      if (!session) return null;
      session.chatHistory.push({ sender, message });
      session.chatHistory.push({ sender: "ai", message: replyText });
      await session.save();
      return session.chatHistory;
    }
    const session = sessionsMemory.find(s => s._id === sessionId);
    if (!session) return null;
    session.chatHistory.push({ sender, message });
    session.chatHistory.push({ sender: "ai", message: replyText });
    return session.chatHistory;
  }
};

module.exports = db;
