# AXIS - Personal AI Operating System

A personal AI operating system designed for users focused on growth, acting like a person who knows you rather than a generic product.

## Features

- **10 AI Personas**: JARVIS, SAGE, CLEO, ATLAS, VEGA, IRON, WREN, DUSK, NOVA, BOLT
- **Invisible Persona Routing**: Automatically routes to the best persona based on intent
- **Ping System**: 27 daily intelligence pings timed to your receptivity (7:30am - 9:00pm)
- **Habit Learning**: 2-4 week adaptation to your patterns and preferences
- **Multilingual**: 10 language support with automatic detection
- **PWA**: Installable with offline capability
- **Twilio SMS**: Push notifications for Power tier users

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npx prisma db push
npm run db:seed

# Start server
npm run dev
```

## Personas

| Persona | Specialty | Blind Spot |
|---------|-----------|------------|
| JARVIS | Business, revenue, execution | May over-focus on efficiency over wellbeing |
| SAGE | Emotional support | May avoid direct confrontation |
| CLEO | Technical subjects (code, mechanics) | May over-explain simple concepts |
| ATLAS | Strategy, planning, roadmaps | May create analysis paralysis |
| VEGA | Culinary discipline | May be judgmental of shortcuts |
| IRON | Physical training, fitness | May push beyond safe limits |
| WREN | Nature, bushcraft, survival | May over-prepare for scenarios |
| DUSK | Philosophical, lateral thinking | May abstract beyond usefulness |
| NOVA | Learning, languages, education | May prioritize breadth over depth |
| BOLT | Urgent, crisis, rapid response | May escalate without context |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/message | Send message, get AI response |
| POST | /api/sessions | Create conversation session |
| GET | /api/pings/:userId | Get pending pings |
| PATCH | /api/pings/:pingId/read | Mark ping as read |
| GET | /api/insights/:userId | Get habit adaptation insights |
| GET | /health | Health check |

## API Examples

### Send a Message
```bash
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{"userId": "user_abc123", "message": "Help me plan my week"}';
```

### Response Format
```json
{
  "response": "I'd be happy to help you plan your week...",
  "persona": "ATLAS",
  "intentDetected": "planning",
  "confidence": 0.92
}
```

### Get User Pings
```bash
curl http://localhost:3000/api/pings/user_abc123
```

### Get Adaptation Insights
```bash
curl http://localhost:3000/api/insights/user_abc123
```

### Mark Ping as Read
```bash
curl -X PATCH http://localhost:3000/api/pings/ping_xyz/read
```

## Troubleshooting

### Connection Issues
- **WebSocket fails**: Check if server is running on correct port
- **Database connection error**: Verify DATABASE_URL in .env

### API Errors
- **400 Bad Request**: Check JSON format and required fields
- **500 Internal Error**: Check server logs for details

### SMS Issues
- Verify Twilio credentials in .env
- Ensure user tier is \`power\` or \`enterprise\`
- Check phone number format (+1XXXXXXXXXX)

### PWA Issues
- Clear browser cache if install prompt doesn\'t appear
- Ensure HTTPS in production (required for service workers)
- Check browser console for SW registration errors

### Habit Learning
- Adaptation requires 2-4 weeks of consistent interactions
- Check that User has active sessions being recorded

### Performance
- Consider reducing conversation history if slow
- Monitor database query performance
- Check Anthropic API response times

## Tech Stack

- **Frontend**: Single-file PWA (HTML/CSS/JS)
- **Backend**: Node.js + Express
- **AI**: Claude Sonnet (Anthropic)
- **Database**: PostgreSQL (Prisma ORM)
- **SMS**: Twilio
- **Hosting**: Railway

## Configuration

Edit \`.env\` with your API keys:
- \`ANTHROPIC_API_KEY\` - Anthropic API key for Claude
- \`DATABASE_URL\` - PostgreSQL connection string
- \`TWILIO_*\` - Twilio credentials for SMS (optional)

## License

MIT - Sovereign Ridge Partners LLC
