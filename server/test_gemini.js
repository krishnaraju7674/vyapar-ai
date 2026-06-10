const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key not found in process.env");
  process.exit(1);
}

console.log("Using API Key starting with:", apiKey.substring(0, 8));

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Say 'hello' in 1 word.");
    const text = result.response.text();
    console.log(`✅ Success for ${modelName}:`, text.trim());
    return true;
  } catch (err) {
    console.error(`❌ Failed for ${modelName}:`, err.message);
    return false;
  }
}

async function run() {
  const models = [
    "gemini-2.0-flash", 
    "gemini-2.0-flash-lite-preview-02-05", 
    "gemini-2.0-pro-exp-02-05", 
    "gemini-1.5-flash"
  ];
  for (const m of models) {
    await testModel(m);
  }
}

run();
