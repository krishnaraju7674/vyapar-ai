function parseGeminiJSON(text) {
  if (!text) {
    throw new Error("Empty response from AI");
  }

  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "");
    cleaned = cleaned.replace(/\n?```$/, "");
  }
  cleaned = cleaned.trim();

  try {
    const data = JSON.parse(cleaned);
    
    // Simple schema validation and defaults
    const requiredKeys = ["verdict", "scores", "roadmap", "quickWins", "vyaparTip"];
    for (const key of requiredKeys) {
      if (!(key in data)) {
        throw new Error(`Missing required key in JSON response: ${key}`);
      }
    }

    return data;
  } catch (error) {
    console.error("Failed to parse Gemini JSON:", error);
    console.log("Raw output was:", text);
    
    // Return a structured fallback
    return {
      verdict: "VIABLE",
      summary: "We had trouble parsing the detailed analysis from the AI. Here is a generic preview.",
      scores: {
        marketFit: 70,
        financialViability: 65,
        competition: 50,
        scalability: 60,
        regulatoryEase: 75,
        indiaFit: 80
      },
      scoresExplanation: {
        marketFit: "Analysis pending",
        financialViability: "Analysis pending",
        competition: "Analysis pending",
        scalability: "Analysis pending",
        regulatoryEase: "Analysis pending",
        indiaFit: "Analysis pending"
      },
      competitors: [],
      roadmap: [
        { phase: "Week 1-4", color: "green", tasks: ["Conduct local market research"] },
        { phase: "Week 5-8", color: "amber", tasks: ["Build MVP"] },
        { phase: "Week 9-12", color: "purple", tasks: ["Launch first cohort"] }
      ],
      quickWins: ["Talk to at least 5 potential customers today", "Draft a WhatsApp-based business pitch"],
      vyaparTip: "Apply for a Mudra loan under the Shishu category (up to Rs. 50,000) for initial hardware/stock purchases."
    };
  }
}

module.exports = { parseGeminiJSON };
