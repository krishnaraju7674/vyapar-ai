const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Allow guest operations if needed, or link to users
  },
  idea: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  result: {
    type: Object,
    required: true
  },
  chatHistory: [
    {
      sender: {
        type: String,
        enum: ["user", "ai"],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Session", SessionSchema);
