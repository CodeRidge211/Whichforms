# AXIS Implementation Reference

## Overview
Built a complete personal AI operating system based on product spec and personal configuration documents.

## Architecture

### Core Systems
1. **PersonaRouter** - 10 AI personas with intent-based routing
2. **PingScheduler** - 27 daily pings (7:30am-9:00pm)
3. **HabitLearner** - 2-4 week user adaptation
4. **MultilingualRouter** - 10 language automatic detection
5. **TwilioService** - SMS for Power tier users

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| server.js | ~300 | Express + WebSocket server |
| lib/personaRouter.js | ~200 | 10 personas with blind spots |
| lib/pingScheduler.js | ~150 | Cron-based ping system |
| lib/habitLearner.js | ~180 | Adaptation logic |
| lib/multilingualRouter.js | ~70 | Language detection |
| lib/twilioService.js | ~60 | SMS integration |
| prisma/schema.prisma | ~70 | Database schema |
| public/index.html | ~250 | PWA frontend |

## AI System Design

### Persona Routing
- Intent detection via keyword matching
- Confidence scoring based on keyword density
- Fallback to NOVA for ambiguous messages

### Habit Learning
- Week-based data collection (weeks 1-4)
- Completion rate calculation per action
- Adaptation insights generation

## Key Decisions
1. Single-file PWA for easy deployment
2. WebSocket for real-time pings
3. Prisma ORM for type-safe database access
4. Cron jobs for ping scheduling

## Code Quality
- Input validation on all endpoints
- Error handling with meaningful messages
- Security: phone number sanitization, message length limits
