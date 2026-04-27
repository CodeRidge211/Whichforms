# AXIS Personal AI

**Owner:** Lily Palmer · Sovereign Ridge Partners LLC
**Repository:** [Whichforms](https://github.com/CodeRidge211/Whichforms)

AXIS is a personalized AI backend server — not a generic chatbot, but a system built specifically for Lily's life, goals, and rhythms.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key (for Claude AI integration)

### Local Development

```bash
cd axis
npm install
export ANTHROPIC_API_KEY=sk-ant-your-key-here  # Linux/Mac
# or set in .env file
npm run dev
```

The server runs on `http://localhost:3000`

### Deploy to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Set your API key: `railway variables set ANTHROPIC_API_KEY=sk-ant-your-key-here`
5. Deploy: `railway up`
6. Get your URL: `railway open`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check — returns server status |
| `POST` | `/chat` | Send a message and get an AI response |
| `GET` | `/checkin` | Time-aware proactive check-in based on Lily's schedule |
| `GET` | `/schedule` | Today's block schedule with active/upcoming blocks |
| `GET` | `/memory` | Retrieve session memory |
| `PATCH` | `/memory` | Update specific memory values |
| `DELETE` | `/session/:userId` | Clear a user's session |

### Example: Chat Request

```bash
curl -X POST https://your-railway-url.up.railway.app/chat \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: sk-ant-your-key-here' \
  -d '{
    "message": "What should I focus on right now?",
    "userId": "lily",
    "context": {
      "prios": ["Finish OBD Vault pricing page", "Send Ridgeline follow-ups"],
      "habits": "workout: done, water: 3/8"
    }
  }'
```

> **Local testing:** Use `http://localhost:3000` and send the `x-api-key` header with your key.

---

## 🎯 Features

- **Personalized AI** — Built specifically for Lily's context (businesses, languages, goals)
- **Block Schedule Engine** — Knows her daily structure and checks in proactively
- **Agent Routing** — Routes requests to specialized agents (coder, writer, planner, searcher, thinker)
- **Session Memory** — Tracks goals, wins, and challenges across conversations
- **Proactive Check-ins** — Time-aware messages based on her schedule blocks

---

## 🧠 The Five Pillars

Lily's life framework baked into every AI interaction:

1. **Health** — Workout plan, from-scratch cooking, hammock camping
2. **Mental** — Anxiety management, journal practice, gratitude
3. **Spirituality** — Morning prayer + tarot, evening close
4. **Business** — OBD Vault, Ridgeline Property Group, web properties
5. **Education** — 4 languages (Russian, German, Finnish, Spanish), ASE certifications

---

## 💰 Cost

- **Railway:** Free tier — $5 credit/month (enough for personal use)
- **Anthropic:** ~$0.01-0.03 per conversation · ~$5-20/month personal use

**Total: Under $25/month to run your own personal AI**

---

## 📁 Project Structure

```
axis/
├── server.js              # Main Express server with all routes
├── package.json           # Dependencies (express, cors)
├── .gitignore             # Node.js gitignore
├── railway.json           # Railway deployment config
├── axis-frontend-config.js # Frontend integration guide
├── README.md              # Detailed AXIS documentation
└── public/
    └── index.html         # Static frontend (optional)

README.md                  # This file (root level)
.gitignore                # Root gitignore (Windows/system files)
```

---

## 🛠️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for Claude integration |
| `PORT` | No | Server port (default: 3000) |

### Frontend Integration

Update `axis-frontend-config.js` with your Railway URL:
```javascript
const API_BASE = 'https://your-railway-url.up.railway.app';
```

---

## 📜 License

Proprietary — Lily Palmer / Sovereign Ridge Partners LLC