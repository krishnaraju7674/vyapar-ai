const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../utils/db");

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function pick(arr, seed) { return arr[seed % arr.length]; }

function generateFallbackReply(message, idea, category) {
  const msg = message.toLowerCase();
  const seed = hashStr(message + idea);

  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("namaste")) {
    const replies = [
      `Namaste! Vyapar AI here for "${idea}". What would you like to discuss? (funding, marketing, setup, or competitors)`,
      `Hello! I see you're working on "${idea}" in "${category}". How can I help you today?`,
      `Namaste! Ready to assist with "${idea}". Ask me about market strategy, funding, or operational planning for your ${category} business.`,
    ];
    return pick(replies, seed);
  }

  if (msg.includes("loan") || msg.includes("money") || msg.includes("fund") || msg.includes("capital") || msg.includes("finance")) {
    const replies = [
      `For "${idea}", check Pradhan Mantri MUDRA Yojana — collateral-free loans up to Rs. 10 Lakhs. For ${category}, the Shishu category (up to Rs. 50,000) is ideal. Have you registered for MSME Udyam yet?`,
      `Great question! For "${idea}" consider Mudra loans (Shishu: 50k, Kishor: 5L, Tarun: 10L). Also check state-specific startup subsidies for ${category}. I can help compare options.`,
    ];
    return pick(replies, seed);
  }

  if (msg.includes("market") || msg.includes("customer") || msg.includes("sell") || msg.includes("reach") || msg.includes("promote") || msg.includes("advertis")) {
    const replies = [
      `For "${idea}", start with WhatsApp Business broadcasts and a Google Business Profile. In ${category}, neighborhood cross-promotions and housing society tie-ups work well.`,
      `To market "${idea}" in ${category}, leverage Instagram and WhatsApp for hyperlocal reach. Partner with local influencers. UPI-based referral discounts work great!`,
    ];
    return pick(replies, seed + 1);
  }

  if (msg.includes("competitor") || msg.includes("rival") || msg.includes("other business") || msg.includes("alternative") || msg.includes("market share")) {
    const replies = [
      `In ${category}, you compete with local players and quick-commerce platforms. The key for "${idea}" is a hyperlocal niche — specialized service or local delivery partnerships to differentiate.`,
      `Competition in ${category} is fragmented. For "${idea}", focus on an unmet need: faster delivery, better quality, or lower minimum orders. Niche down before scaling out.`,
    ];
    return pick(replies, seed + 2);
  }

  if (msg.includes("license") || msg.includes("register") || msg.includes("gst") || msg.includes("legal") || msg.includes("permit") || msg.includes("compliance")) {
    const replies = [
      `For ${category}, start with a free MSME Udyam Certificate. Food needs FSSAI (Rs. 100/yr for micro). GST above Rs. 20L (services) or Rs. 40L (goods). A local CA helps with state permits.`,
      `Key registrations for "${idea}": 1) MSME Udyam (free), 2) Shop & Establishment, 3) GST if turnover exceeds threshold. For ${category}, check sector-specific licenses too.`,
    ];
    return pick(replies, seed + 3);
  }

  const generics = [
    `Great question about "${idea}". I suggest a small WhatsApp pilot with 15-20 potential customers to validate pricing before committing capital to ${category} operations.`,
    `For "${idea}" in ${category}, the smartest first step is customer discovery. Talk to 10 potential users this week, note pain points, and adjust. Let me know if you need funding or legal help!`,
    `That is relevant to "${idea}". Start by identifying your top 3 assumptions and testing them cheaply. In ${category}, a small pilot can save significant time and money.`,
  ];
  return pick(generics, seed + 4);
}

// @route   POST api/chat
// @desc    Follow-up chat with idea context
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "Session ID and message are required" });
    }

    const session = await db.findSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build chat context
    const contextPrompt = `You are Vyapar AI, the leading startup and business advisor tailored specifically for the Indian market.
The user is discussing the following business idea that they submitted:
Idea: "${session.idea}"
Category: "${session.category}"

Here was your original analysis of the business idea:
- Verdict: ${session.result.verdict}
- Summary: ${session.result.summary}
- India Fit Score: ${session.result.scores.indiaFit}/100
- Custom Vyapar Tip: ${session.result.vyaparTip}

Here is the conversation history so far:
${session.chatHistory.map(h => `${h.sender === "user" ? "User" : "AI"}: ${h.message}`).join("\n")}

The user just sent this follow-up message:
User: ${message}

Provide a helpful, professional, and practical response as Vyapar AI. Keep it conversational, under 150 words, and focused on helping them succeed in the Indian context (discussing micro-funding, Mudra scheme, UPI, WhatsApp business, kirana partnerships, or regional rules when relevant). Do not return JSON; respond with text.`;

    let replyText;
    try {
      const result = await model.generateContent(contextPrompt);
      replyText = result.response.text().trim();
    } catch (apiErr) {
      console.warn("Gemini Chat failed, generating local fallback reply:", apiErr.message);
      // Run dynamic contextual generator
      replyText = generateFallbackReply(message, session.idea, session.category);
    }

    const updatedHistory = await db.addChatMessage(sessionId, "user", message, replyText);
    if (!updatedHistory) {
      return res.status(404).json({ error: "Session not found during update" });
    }

    res.json({
      success: true,
      chatHistory: updatedHistory
    });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: err.message || "An error occurred during chat" });
  }
});

module.exports = router;
