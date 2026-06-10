# Vyapar AI - Indian Market Business Advisor Hub

A modern business analyzer and planning advisor tailored specifically for the Indian market, incorporating Tier 1/2/3 market fit assessments, Mudra/MSME scheme integration, live competitor grounding via Google Search, and 90-day roadmaps.

## Codebase Structure

- **`client/`**: React + TypeScript + Vite + Tailwind CSS frontend. Includes shadcn-style componentPrimitives and visualizations like Recharts Radar chart.
- **`server/`**: Express + Node.js + MongoDB + Gemini 1.5 Flash API with Search Grounding tools.

---

## Getting Started

### 1. Database Setup
Ensure that MongoDB is running locally on your default port (`27017`) or configure your remote connection URI in the environment variables.

### 2. Configure Backend Environment
Create/edit `server/.env` and supply your Gemini API key:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vyapar-ai
JWT_SECRET=vyapar-secret-key-12345
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install & Start Server
```bash
cd server
npm install
npm run start
```
The server will boot on `http://localhost:5000`.

### 4. Install & Start Client
```bash
cd client
npm install
npm run dev
```
The client will launch on `http://localhost:5173`.

---

## Key Pages

- **Home Page (`/`)**: Main hub embedding the premium `RuixenMoonChat` input system, custom-tailored for regional startups, and quick vertical selectors.
- **Dashboard Page (`/dashboard/:sessionId`)**: Shows scored metric evaluations, radar chart visualizations, 90-day week-by-week roadmaps, competitor listings, and has a PDF report exporter.
- **History Hub (`/history`)**: Allows registration/login to preserve and manage historical analysis sessions.
- **Demo Page (`/demo`)**: The raw chat component (`ruixen-moon-chat.tsx`) in isolation, showing the original component design.
