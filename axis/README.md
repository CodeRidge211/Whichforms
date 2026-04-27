# AXIS API Server
## Lily Palmer · Sovereign Ridge Partners LLC

Your personal AI backend. Your key, your server, your data.

### Deploy to Railway (20 minutes)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Create project**
   ```bash
   railway init
   ```

4. **Set your Anthropic key**
   ```bash
   railway variables set ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get your URL**
   ```bash
   railway open
   ```
   Copy the URL — it looks like `https://axis-api-production-xxxx.up.railway.app`

7. **Update AXIS frontend**
   In your axis HTML file, set:
   ```javascript
   const API_BASE = 'https://your-railway-url.up.railway.app';
   ```

### Local Development

```bash
cd axis
npm install
cp .env.example .env
# Edit .env with your Anthropic key
npm run dev
```

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | / | Health check |
| POST | /chat | Main chat |
| GET | /checkin | Time-aware proactive check-in |
| GET | /schedule | Today's block schedule |
| GET | /memory | Session memory |
| PATCH | /memory | Update memory |

### POST /chat

```json
{
  \"message\": \"What should I focus on right now?\",
  \"userId\": \"lily\",
  \"context\": {
    \"prios\": [\"Finish OBD Vault pricing page\", \"Send Ridgeline follow-ups\"],
    \"habits\": \"workout: done, water: 3/8\"
  }
}
```

### Cost

Railway free tier: $5 credit/month (enough for personal use)
Anthropic: ~$0.01-0.03 per conversation · ~$5-20/month personal use

Total: under $25/month to run your own AI.