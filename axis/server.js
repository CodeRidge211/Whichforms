require('dotenv').config();
const path = require('path');

// Sentry error tracking initialization
if (process.env.SENTRY_DSN) {
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  });
  app.use(Sentry.Handlers.requestHandler());
}
const express = require('express');
const cors = require('cors');
const http = require('http');
const cron = require('node-cron');
const { WebSocketServer } = require('ws');
const { PrismaClient } = require('@prisma/client');
const Anthropic = require('@anthropic-ai/sdk');
const { PersonaRouter } = require('./lib/personaRouter');
const { PingScheduler } = require('./lib/pingScheduler');
const { HabitLearner } = require('./lib/habitLearner');
const { MultilingualRouter } = require('./lib/multilingualRouter');
const { TwilioService } = require('./lib/twilioService');
const { sovereign, sovereignPromptLayer, serializeSovereignMemory, deserializeSovereignMemory } = require('./lib/sovereign');
const { HealthCheckup } = require('./lib/healthCheckup');
const { ContextMemory } = require('./lib/contextMemory');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();
const anthropic = new Anthropic();
const personaRouter = new PersonaRouter(anthropic);
const pingScheduler = new PingScheduler(prisma);
const contextMemory = new ContextMemory(prisma);
const habitLearner = new HabitLearner(prisma);
const multilingualRouter = new MultilingualRouter();
const twilioService = new TwilioService();
const healthCheckup = new HealthCheckup(prisma);

app.use(cors({ 
  origin: process.env.CORS_ORIGINS?.split(',') || '*', 
  credentials: true 
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Serve index.html for root path (SPA fallback)
app.get('/', (req, res) => {

// Public configuration endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || null,
  });
});

// Get user's learned context (for debugging/display)
app.get('/api/context/:userId', async (req, res) => {
  try {
    const summary = await contextMemory.getContextSummary(req.params.userId);
    res.json(summary);
  } catch (error) {
    console.error('Context fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch context' });
  }
});

// Delete specific context entry (for user corrections)
app.delete('/api/context/:userId/:category/:key', async (req, res) => {
  try {
    const { userId, category, key } = req.params;
    await prisma.contextEntry.delete({
      where: { userId_category_key: { userId, category, key } },
    });
    res.json({ success: true, message: `Deleted ${category}.${key}` });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Context entry not found' });
    }
    console.error('Context delete error:', error);
    res.status(500).json({ error: 'Failed to delete context' });
  }
});

// Update specific context entry (for user corrections)
app.patch('/api/context/:userId/:category/:key', async (req, res) => {
  try {
    const { userId, category, key } = req.params;
    const { value } = req.body;
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return res.status(400).json({ error: 'Valid string value required' });
    }
    
    const updated = await contextMemory.updateContext(userId, category, key, value.trim());
    res.json({ success: true, entry: updated });
  } catch (error) {
    console.error('Context update error:', error);
    res.status(500).json({ error: 'Failed to update context' });
  }
});

// Get context by category
app.get('/api/context/:userId/:category', async (req, res) => {
  try {
    const entries = await contextMemory.getContextByCategory(req.params.userId, req.params.category);
    res.json({ category: req.params.category, entries });
  } catch (error) {
    console.error('Context fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch context' });
  }
});
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Helper: load or create sovereign state for user
async function getUserSovereignState(userId) {
  let state = await prisma.sovereignState.findUnique({ where: { userId } });
  if (!state) {
    state = await prisma.sovereignState.create({
      data: { userId, state: 'BUILD', accountability: '{}' }
    });
  }
  return {
    state: state.state,
    cyclePhase: state.cyclePhase,
    streak: state.streak,
    accountability: deserializeSovereignMemory(state.accountability)
  };
}

// Helper: save sovereign state after update
async function saveUserSovereignState(userId, sovereignResult) {
  await prisma.sovereignState.upsert({
    where: { userId },
    update: {
      state: sovereignResult.state,
      cyclePhase: sovereignResult.cyclePhase,
      streak: sovereignResult.streak,
      accountability: serializeSovereignMemory(sovereignResult.accountability),
      lastUpdated: new Date()
    },
    create: {
      userId,
      state: sovereignResult.state,
      cyclePhase: sovereignResult.cyclePhase,
      streak: sovereignResult.streak,
      accountability: serializeSovereignMemory(sovereignResult.accountability)
    }
  });
}

// Helper: get user gender
async function getUserGender(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.gender || 'female';
}

// Helper: log interaction with metadata for cycle trend analysis
async function logInteraction(userId, type, content, metadata = {}) {
  await prisma.interaction.create({
    data: {
      userId,
      type,
      content,
      metadata: JSON.stringify(metadata)
    }
  });
}

app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, persona, language, gender } = req.body;
    if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'userId required' });
    await prisma.user.upsert({ 
      where: { id: userId }, 
      update: { gender: gender || 'female' }, 
      create: { id: userId, gender: gender || 'female' } 
    });
    const session = await prisma.session.create({
      data: { userId, persona: persona || 'JARVIS', language: language || 'en' }
    });
    res.json(session);
  } catch (error) { console.error('Session error:', error); res.status(500).json({ error: 'Failed to create session' }); }
});

app.post('/api/message', async (req, res) => {
  try {
    const { userId, message, persona, context } = req.body;
    if (!userId || !message || typeof message !== 'string' || message.length > 10000) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }
    await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } });
    const language = multilingualRouter.detectLanguage(message);
    const gender = await getUserGender(userId);
    const routedPersona = persona || personaRouter.route(message, context);
    let session = await prisma.session.findFirst({ where: { userId, endedAt: null }, orderBy: { startedAt: 'desc' } });
    if (!session) session = await prisma.session.create({ data: { userId, persona: routedPersona, language } });
    let messages = [];
    try { messages = JSON.parse(session.messages || '[]'); } catch { messages = []; }
    messages.push({ role: 'user', content: message, timestamp: new Date().toISOString() });
    
    // ── SOVEREIGN INTEGRATION ──
    const userSovereignState = await getUserSovereignState(userId);
    const sovereignResult = sovereign(message, userSovereignState.accountability, userId, gender);
    pingScheduler.updateSovereignState(userId, sovereignResult);
    
    // ── HEALTH CHECKUP TRIGGER ──
    let healthCheckupPopup = null;
    if (sovereignResult.healthCheckupTrigger) {
      const shouldTrigger = await healthCheckup.shouldTriggerCheckup(userId);
      if (shouldTrigger.trigger) {
        healthCheckupPopup = healthCheckup.buildPopupContent(gender, 'state_change');
      }
    }
    
    // Build system prompt
    let systemPrompt;
    if (sovereignResult.responseStyle.personaActive === false) {
      systemPrompt = 'You are AXIS, a warm and present AI assistant. ';
    } else {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const preferences = await prisma.userPreference.findUnique({ where: { userId } });
      const personaContext = personaRouter.getPersonaContext(routedPersona, user, preferences);
      systemPrompt = typeof personaContext === 'string' ? personaContext : personaContext.p || '';
    }
    systemPrompt += sovereignPromptLayer(sovereignResult);
    
    // Inject learned user context so AXIS knows your situation without asking
    const userContext = await contextMemory.getContextForPrompt(userId);
    if (userContext) {
      systemPrompt += userContext;
    }
    
    const maxTokens = sovereignResult.responseStyle.maxWords 
      ? Math.min(sovereignResult.responseStyle.maxWords * 4, 1024) 
      : 1024;
    
    const response = await anthropic.messages.create({ 
      model: 'claude-sonnet-4-20250514', 
      max_tokens: maxTokens, 
      system: systemPrompt, 
      messages: messages.slice(-20) 
    });
    const assistantMessage = response.content[0].text;
    messages.push({ role: 'assistant', content: assistantMessage, persona: routedPersona, timestamp: new Date().toISOString() });
    
    await prisma.session.update({ where: { id: session.id }, data: { messages: JSON.stringify(messages), persona: routedPersona } });
    
    // Log interaction with cycle phase metadata for trend analysis
    await logInteraction(userId, 'message', message, { 
      gender,
      cyclePhase: sovereignResult.cyclePhase,
      hrtPhase: sovereignResult.hrtPhase,
      state: sovereignResult.state,
      recentSymptoms: sovereignResult.accountability.recentSymptoms
    });
    
    // Learn context from user messages (self-learning)
    await contextMemory.learnFromMessage(userId, message);
    
    habitLearner.recordInteraction(userId, 'message', { persona: routedPersona });
    await saveUserSovereignState(userId, sovereignResult);
    
    res.json({ 
      response: assistantMessage, 
      persona: routedPersona, 
      language,
      sovereignState: sovereignResult.state,
      cyclePhase: sovereignResult.cyclePhase,
      healthCheckup: healthCheckupPopup
    });
  } catch (error) { console.error('Message error:', error); res.status(500).json({ error: 'Failed to process message' }); }
});

app.get('/api/pings/:userId', async (req, res) => {
  try {
    const pings = await prisma.ping.findMany({ where: { userId: req.params.userId, sentAt: { not: null }, read: false }, orderBy: { scheduledAt: 'desc' }, take: 50 });
    res.json(pings);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch pings' }); }
});

app.patch('/api/pings/:pingId/read', (req, res) => {
  try { res.json(prisma.ping.update({ where: { id: req.params.pingId }, data: { read: true, readAt: new Date() } })); }
  catch (error) { res.status(500).json({ error: 'Failed to update ping' }); }
});

app.get('/api/habits/:userId', (req, res) => {
  try { res.json(prisma.habit.findMany({ where: { userId: req.params.userId } })); }
  catch (error) { res.status(500).json({ error: 'Failed to fetch habits' }); }
});

app.get('/api/insights/:userId', (req, res) => {
  try { res.json(habitLearner.getInsights(req.params.userId)); }
  catch (error) { res.status(500).json({ error: 'Failed to generate insights' }); }
});

// ── SOVEREIGN STATE ENDPOINTS ──
app.get('/api/sovereign/:userId', async (req, res) => {
  try {
    const state = await getUserSovereignState(req.params.userId);
    const gender = await getUserGender(req.params.userId);
    res.json({ ...state, gender });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch sovereign state' }); }
});

app.patch('/api/sovereign/:userId', async (req, res) => {
  try {
    const { cyclePhase, state: manualState, hrtPhase } = req.body;
    const current = await getUserSovereignState(req.params.userId);
    const gender = await getUserGender(req.params.userId);
    
    const updatedAccountability = {
      ...current.accountability,
      cyclePhase: cyclePhase ?? current.cyclePhase,
      hrtPhase: hrtPhase ?? current.hrtPhase
    };
    
    // Use manual state if provided, otherwise run sovereign
    let sovereignResult;
    if (manualState && ['FLOW', 'BUILD', 'HOLD', 'REST', 'PROTECT'].includes(manualState)) {
      // Create a sovereign-like result with manual state
      const { STATES, PING_THROTTLE, getResponseStyle } = require('./lib/sovereign');
      sovereignResult = {
        state: manualState,
        cyclePhase: cyclePhase ?? current.cyclePhase,
        hrtPhase: hrtPhase ?? current.hrtPhase,
        streak: current.streak,
        accountability: updatedAccountability,
        responseStyle: getResponseStyle(manualState, gender),
        pingThrottle: PING_THROTTLE[manualState]
      };
    } else {
      sovereignResult = sovereign('', updatedAccountability, req.params.userId, gender);
      sovereignResult.cyclePhase = cyclePhase ?? sovereignResult.cyclePhase;
      sovereignResult.hrtPhase = hrtPhase ?? sovereignResult.hrtPhase;
      sovereignResult.accountability = updatedAccountability;
    }
    
    await saveUserSovereignState(req.params.userId, sovereignResult);
    
    // Log state change for trend analysis
    await logInteraction(req.params.userId, 'state_change', `State manually set to ${sovereignResult.state}`, {
      previousState: current.state,
      newState: sovereignResult.state,
      cyclePhase: sovereignResult.cyclePhase,
      hrtPhase: sovereignResult.hrtPhase
    });
    
    res.json({ success: true, state: sovereignResult.state, cyclePhase: sovereignResult.cyclePhase, hrtPhase: sovereignResult.hrtPhase });
  } catch (error) { res.status(500).json({ error: 'Failed to update sovereign state' }); }
});

// ── HEALTH CHECKUP ENDPOINTS ──
app.get('/api/health-checkup/:userId', async (req, res) => {
  try {
    const gender = await getUserGender(req.params.userId);
    const shouldTrigger = await healthCheckup.shouldTriggerCheckup(req.params.userId);
    
    if (shouldTrigger.trigger) {
      const popup = healthCheckup.buildPopupContent(gender, shouldTrigger.reason);
      res.json({ 
        triggered: true, 
        reason: shouldTrigger.reason,
        daysSinceLast: shouldTrigger.daysSinceLast,
        popup
      });
    } else {
      res.json({ triggered: false, reason: null });
    }
  } catch (error) { res.status(500).json({ error: 'Failed to check health status' }); }
});

app.post('/api/health-checkup/:userId', async (req, res) => {
  try {
    const { sleepQuality, moodLevel, energyLevel, symptoms, cycleDay, notes, triggeredBy } = req.body;
    const checkup = await healthCheckup.saveCheckup(req.params.userId, {
      sleepQuality, moodLevel, energyLevel, symptoms, cycleDay, notes, triggeredBy
    });
    const insights = await healthCheckup.getHealthInsights(req.params.userId);
    res.json({ success: true, checkup, insights });
  } catch (error) { res.status(500).json({ error: 'Failed to save health checkup' }); }
});

app.get('/api/health-checkup/:userId/insights', async (req, res) => {
  try {
    const insights = await healthCheckup.getHealthInsights(req.params.userId);
    res.json(insights);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch health insights' }); }
});

// ── SOVEREIGN DASHBOARD ENDPOINT ──
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [sovereignState, healthInsights, recentInteractions, streakData] = await Promise.all([
      getUserSovereignState(userId),
      healthCheckup.getHealthInsights(userId),
      prisma.interaction.findMany({ 
        where: { userId, type: 'message' },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      Promise.resolve({
        current: sovereignState.streak,
        recentWins: sovereignState.accountability.wins?.slice(0, 5) || [],
        pendingCommitment: sovereignState.accountability.commitments?.find(c => !c.checked) || null
      })
    ]);

    // Calculate mood/energy trends from recent interactions
    const moodTrend = recentInteractions.slice(0, 7).map(i => {
      try {
        const meta = JSON.parse(i.metadata || '{}');
        return meta.moodLevel;
      } catch { return null; }
    }).filter(Boolean);

    const avgMood = moodTrend.length > 0 ? moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length : null;

    res.json({
      sovereign: {
        state: sovereignState.state,
        cyclePhase: sovereignState.cyclePhase,
        hrtPhase: sovereignState.hrtPhase,
        streak: streakData.current,
        pendingCommitment: streakData.pendingCommitment,
        recentWins: streakData.recentWins.map(w => ({ text: w.text, timestamp: w.timestamp }))
      },
      health: healthInsights,
      moodTrend: avgMood,
      summary: {
        totalInteractions: recentInteractions.length,
        lastActivity: recentInteractions[0]?.createdAt || null,
        stateChangeCount: recentInteractions.filter(i => i.type === 'state_change').length
      }
    });
  } catch (error) { console.error('Dashboard error:', error); res.status(500).json({ error: 'Failed to fetch dashboard' }); }
});

// ── PERSONA SETTINGS ENDPOINT ──
app.get('/api/persona/:userId', async (req, res) => {
  try {
    const preferences = await prisma.userPreference.findUnique({ where: { userId: req.params.userId } });
    const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
    res.json({
      name: user?.personaName || 'AXIS',
      gender: user?.gender || 'female',
      traits: preferences ? {
        warmth: preferences.warmth || 7,
        directness: preferences.directness || 5,
        supportLevel: preferences.supportLevel || 7
      } : { warmth: 7, directness: 5, supportLevel: 7 },
      focus: preferences?.focusAreas || ['accountability', 'health'],
      style: preferences?.responseStyle || 'balanced'
    });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch persona settings' }); }
});

app.patch('/api/persona/:userId', async (req, res) => {
  try {
    const { name, gender, traits, focus, style } = req.body;
    
    // Validate warmth, directness, and supportLevel (must be 1-10)
    if (traits) {
      if (traits.warmth !== undefined && (traits.warmth < 1 || traits.warmth > 10)) {
        return res.status(400).json({ error: 'warmth must be between 1 and 10' });
      }
      if (traits.directness !== undefined && (traits.directness < 1 || traits.directness > 10)) {
        return res.status(400).json({ error: 'directness must be between 1 and 10' });
      }
      if (traits.supportLevel !== undefined && (traits.supportLevel < 1 || traits.supportLevel > 10)) {
        return res.status(400).json({ error: 'supportLevel must be between 1 and 10' });
      }
    }
    
    // Update user record
    await prisma.user.upsert({
      where: { id: req.params.userId },
      update: { 
        personaName: name,
        gender: gender || 'female'
      },
      create: { 
        id: req.params.userId, 
        personaName: name || 'AXIS',
        gender: gender || 'female'
      }
    });
    
    // Update preferences
    await prisma.userPreference.upsert({
      where: { userId: req.params.userId },
      update: {
        warmth: traits?.warmth,
        directness: traits?.directness,
        supportLevel: traits?.supportLevel,
        focusAreas: focus,
        responseStyle: style
      },
      create: {
        userId: req.params.userId,
        warmth: traits?.warmth || 7,
        directness: traits?.directness || 5,
        supportLevel: traits?.supportLevel || 7,
        focusAreas: focus || ['accountability', 'health'],
        responseStyle: style || 'balanced'
      }
    });
    
    res.json({ success: true, message: 'Persona settings updated' });
  } catch (error) { res.status(500).json({ error: 'Failed to update persona settings' }); }
});

// ── CYCLE TREND ENDPOINT ──
app.get('/api/cycle-trends/:userId', async (req, res) => {
  try {
    const interactions = await prisma.interaction.findMany({
      where: { userId: req.params.userId, type: 'message' },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Extract cycle phase transitions
    const cyclePhases = [];
    interactions.forEach(i => {
      try {
        const meta = JSON.parse(i.metadata || '{}');
        if (meta.cyclePhase) {
          cyclePhases.push({
            phase: meta.cyclePhase,
            timestamp: i.createdAt,
            moodLevel: meta.moodLevel
          });
        }
      } catch { /* skip */ }
    });

    // Group by phase and calculate average mood
    const phaseStats = {};
    cyclePhases.forEach(cp => {
      if (!phaseStats[cp.phase]) {
        phaseStats[cp.phase] = { count: 0, totalMood: 0 };
      }
      phaseStats[cp.phase].count++;
      if (cp.moodLevel) phaseStats[cp.phase].totalMood += cp.moodLevel;
    });

    const trends = Object.entries(phaseStats).map(([phase, stats]) => ({
      phase,
      occurrences: stats.count,
      avgMood: stats.count > 0 ? Math.round((stats.totalMood / stats.count) * 10) / 10 : null
    }));

    res.json({
      totalLogged: cyclePhases.length,
      trends,
      recentPhases: cyclePhases.slice(0, 14) // last 2 weeks
    });
  } catch (error) { res.status(500).json({ error: 'Failed to fetch cycle trends' }); }
});

wss.on('connection', async (ws, req) => {
  const userId = new URL(req.url, 'http://localhost').searchParams.get('userId');
  if (!userId) { ws.close(4001, 'User ID required'); return; }
  const pendingPings = await prisma.ping.findMany({ where: { userId, sentAt: { not: null }, read: false }, orderBy: { scheduledAt: 'asc' } });
  for (const ping of pendingPings) ws.send(JSON.stringify({ type: 'ping', data: ping }));
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'pong') await prisma.ping.update({ where: { id: data.pingId }, data: { deliveredAt: new Date() } });
      if (data.type === 'health_checkup_response') {
        await healthCheckup.saveCheckup(userId, data.payload);
        ws.send(JSON.stringify({ type: 'health_checkup_confirmed' }));
      }
    } catch (error) { console.error('WebSocket message error:', error); }
  });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) pingScheduler.startUserSchedule(userId, ws);
  
  const sovereignState = await getUserSovereignState(userId);
  const gender = await getUserGender(userId);
  const sovereignResult = sovereign('', sovereignState.accountability, userId, gender);
  pingScheduler.updateSovereignState(userId, sovereignResult);

  // Check if health checkup should be triggered on connection
  const shouldTrigger = await healthCheckup.shouldTriggerCheckup(userId);
  if (shouldTrigger.trigger) {
    const popup = healthCheckup.buildPopupContent(gender, shouldTrigger.reason);
    ws.send(JSON.stringify({ type: 'health_checkup_popup', data: popup }));
  }
});

pingScheduler.start();

// ── WEEKLY HEALTH CHECKUP CRON JOB ──
// Runs daily at 9am to check for users who need health checkups
cron.schedule('0 9 * * *', async () => {
  console.log('[HealthCheckup Cron] Running daily health checkup scan...');
  try {
    const users = await prisma.user.findMany({ include: { preferences: true } });
    
    for (const user of users) {
      const shouldTrigger = await healthCheckup.shouldTriggerCheckup(user.id);
      
      if (shouldTrigger.trigger) {
        // Check if user is connected via WebSocket
        const ws = pingScheduler.wsConnections.get(user.id);
        
        if (ws && ws.readyState === 1) { // WebSocket.OPEN = 1
          // User is connected - send popup directly
          const gender = user.gender || 'female';
          const popup = healthCheckup.buildPopupContent(gender, shouldTrigger.reason);
          ws.send(JSON.stringify({ type: 'health_checkup_popup', data: popup }));
          console.log(`[HealthCheckup Cron] Sent popup to connected user: ${user.id}`);
        } else {
          // User not connected - log that they need checkup on next connect
          // The check already happens in wss.on('connection') via shouldTriggerCheckup
          console.log(`[HealthCheckup Cron] User ${user.id} offline, will prompt on connect`);
        }
      }
    }
    
    console.log(`[HealthCheckup Cron] Completed scan for ${users.length} users`);
  } catch (error) {
    console.error('[HealthCheckup Cron] Error:', error);
  }
});
// Sentry error handling - must be last middleware before server.listen
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`AXIS server running on port ${PORT}`);
  if (process.env.SENTRY_DSN) {
    console.log('[Sentry] Error tracking enabled');
  }
});
process.on('SIGTERM', async () => { await prisma.$disconnect(); server.close(); process.exit(0); });