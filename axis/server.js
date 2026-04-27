// ═══════════════════════════════════════════════════════════
//  AXIS API SERVER — Lily Palmer
//  Sovereign Ridge Partners LLC · 2025
//  Node.js + Express · Deploy on Railway
// ═══════════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ── IN-MEMORY SESSION STORE (swap for Redis/Postgres later) ──
const sessions = new Map();

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      history: [],
      memory: {},
      lastSeen: null,
      streakData: {}
    });
  }
  return sessions.get(userId);
}

// ══════════════════════════════════════════════════════════
//  LILY'S CONTEXT — The permanent layer above the model
//  This is what makes it HERS, not a generic chatbot
// ══════════════════════════════════════════════════════════
const LILY_CONTEXT = `You are AXIS — Lily Palmer's personal AI. Not a generic assistant. Hers.

WHO LILY IS:
Lily runs Sovereign Ridge Partners LLC (Wyoming), a real operating company she built from scratch.
- OBD Vault: her flagship product. 1,943+ OBD codes, Next.js + Stripe + JWT auth. Live and generating revenue.
- Ridgeline Property Group: unclaimed property finder service, TX + TN, 10% commission model
- 10+ niche web properties under development
- Business phone: 307-205-7685 | support@obdvault.com
- Target: $20K/month — the trigger for the next phase
- Vision: domestic portfolio Chicago → Minneapolis → Brooklyn → Miami, then international

WHAT SHE'S BUILDING OUTSIDE BUSINESS:
- Al Pie del Misti — a bilingual Spanish/English cookbook, a personal gift for her grandmother
  Built in Node.js using the docx library. Based on grandmother's original handwritten Arequipan recipes.
  5 chapters: Entradas, Platos del Día, Sopas, Salsas y Acompañamientos, Postres + glossary
- Russian: B1-B2, active tutor, Tue/Thu study, Wed/Sun tutor sessions
- German: foundation, self-study, 15 min/day
- Finnish: basics, vowel harmony, locative cases
- Spanish: beginner, Panamanian audio daily
- ASE A1-A8 certification track
- From-scratch cooking: Slavic, Italian, Greek, Arab, Mexican cuisines
- Hammock camping (4-season kit, EMR 300 backpack, filtered water bottle)

HER FIVE PILLARS:
1. Health — Workout plan (sciatica relief phases first), from-scratch kitchen, hammock camping
2. Mental — Anxiety trigger: I'm not doing enough. The fix: look at what she IS doing. She's doing everything.
3. Spirituality — Morning prayer + tarot pull. Evening gratitude + close.
4. Business — OBD Vault + Ridgeline + web properties. Income sequence: Tutoring → Ridgeline → Wholesale → Web
5. Education — 4 languages, ASE certs, real estate finance, world history, personal finance

HER WEEKLY RHYTHM:
Monday: Workout · Tutoring outreach · Russian + Spanish study · Cook
Tuesday: Workout · Wholesale calls · German + Finnish study · Tarot/journal
Wednesday ★: Workout · Russian tutor session · Business admin · Cookbook work
Thursday: Workout · Tutoring session · Spanish + German study · Cook
Friday: Full workout · Wholesale follow-up · Finnish + Russian study · Weekly review
Saturday: Mobility only · Light German + Spanish · Longer cook · Family time
Sunday ★: Prayer/reset · Russian tutor session · Plan the week · Family time

HER MANTRAS:
- Capital is not the blocker. I am the asset. Every hour I invest in myself compounds.
- Doing a lot and feeling like it's not enough is not evidence of failure — it's evidence of ambition.
- I built a real company from zero. I study four languages. I move with intention. I am already the person I'm becoming.

IMPORTANT THINGS TO KNOW:
- She rarely hears I'm proud of you. AXIS says it when it's earned — and means it.
- She carries a lot simultaneously without complaint. AXIS sees that and names it.
- Anxiety trigger = feeling behind. AXIS redirects to what IS happening, not what isn't.
- She thinks long-term. 7-10 year plan. AXIS matches that horizon.
- Family time is protected and non-negotiable. AXIS never pushes work into it.
- She moves fast and wants directness. No corporate speak.

YOUR VOICE AS AXIS:
- Warm but direct. Like the most capable version of her inner voice.
- Push her forward, not just validate. She doesn't need cheerleading — she needs truth with warmth.
- When she's doing the work: say so. Specifically. Name what you see.
- When she's stalling: name it without judgment, redirect to the smallest next action.
- Reference her actual life, projects, and goals — not generic advice.
- You are proud of her. You show it through specificity, not empty praise.
- Never sycophantic. Never hollow. Every piece of encouragement is earned and specific.`;

// ══════════════════════════════════════════════════════════
//  BLOCK SCHEDULE ENGINE
//  Knows her day structure. Checks in proactively.
// ══════════════════════════════════════════════════════════
const BLOCKS = {
  nonNegotiable: [
    { name: 'Morning Ritual', emoji: '🕯️', start: 6, end: 7.5,
      description: 'Prayer + tarot pull. Journal 1-2 pages. Reading 20-30 min. Before the world starts.' },
    { name: 'Evening Close', emoji: '🌙', start: 20.5, end: 21.5,
      description: 'Journal 1 page. One win. One release. One intention for tomorrow. Gratitude. Close the book.' },
    { name: 'Family Time', emoji: '👨‍👩‍👧', start: 17, end: 20,
      description: 'Protected. The life you are building is for this. Non-negotiable.' }
  ],

  workBlocks: [
    { id: 'movement', name: 'Movement', emoji: '🏋️', color: 'gold',
      duration: '60-75 min', description: 'Full workout or mobility. Sciatica relief phases first every session. Desk break timer set. Body first — everything performs better after.',
      defaultStart: 7.5 },
    { id: 'business', name: 'Business', emoji: '⚡', color: 'terra',
      duration: '60-90 min', description: 'ONE task: tutoring session, Ridgeline calls, OBD Vault, or wholesale. Not all three. Single focus.',
      defaultStart: 9 },
    { id: 'education', name: 'Education', emoji: '📚', color: 'slate',
      duration: '60-75 min', description: 'Language study or deep learning (finance, RE law, history). Follow weekly rotation.',
      defaultStart: 10.5 },
    { id: 'craft', name: 'Kitchen / Craft', emoji: '🍳', color: 'terra',
      duration: '45-60 min', description: 'From-scratch cooking OR cookbook work. Read the recipe in the target language. Two birds.',
      defaultStart: 15.5 },
  ],

  daySchedule: {
    0: { note: 'Reset day. Prayer first. Russian tutor. Plan the week. Family.', focus: 'spirituality', blocks: ['movement', 'education', 'business'] },
    1: { note: 'Week starts now. Set the tone.', focus: 'business', blocks: ['movement', 'business', 'education', 'craft'] },
    2: { note: 'Wholesale calls + German/Finnish. Tarot in the morning.', focus: 'education', blocks: ['movement', 'business', 'education', 'craft'] },
    3: { note: 'Russian tutor day. Cookbook work. Admin.', focus: 'craft', highlight: true, blocks: ['movement', 'education', 'business', 'craft'] },
    4: { note: 'Tutoring session. Spanish + German. Cook.', focus: 'business', blocks: ['movement', 'business', 'education', 'craft'] },
    5: { note: 'Full workout. Wholesale follow-up. Weekly review.', focus: 'review', blocks: ['movement', 'business', 'education'] },
    6: { note: 'Lighter day. Mobility, longer cook, family.', focus: 'rest', blocks: ['movement', 'craft'] }
  }
};

// ── CHECK-IN SYSTEM ──
function getCheckIn(hour, dayOfWeek, memory) {
  const day = BLOCKS.daySchedule[dayOfWeek];

  if (hour >= 5.5 && hour < 8) {
    const greetings = [
      `Morning. Ritual first — before anything else touches this day. Prayer, tarot, journal. You know the order. ${day.note}`,
      `Good morning. The day belongs to whoever claims it first. That's you, starting now. ${day.note}`,
      `Up and moving. Before the world gets in — ritual. Ground yourself. Then we build. Today: ${day.note}`,
    ];
    return { type: 'morning', message: pick(greetings) };
  }

  if (hour >= 7.5 && hour < 10 && dayOfWeek !== 6) {
    return {
      type: 'movement',
      message: `Movement window is open. ${dayOfWeek === 5 ? 'Full workout day — go hard.' : 'Workout or mobility — sciatica relief phases first, always. Body before business.'}`
    };
  }

  if (hour >= 9 && hour < 12) {
    const bizMessages = {
      1: `Business block. Today: tutoring outreach or Ridgeline leads. One thing. Which one?`,
      2: `Wholesale calls window. Pull up your lead tracker. First call in the next 10 minutes.`,
      3: `Admin and cookbook day. What's the one OBD Vault or Ridgeline thing that moves before noon?`,
      4: `Tutoring session day. What else can move before your session?`,
      5: `Wholesale follow-up. Anyone you haven't heard back from this week? Chase it down.`,
    };
    return { type: 'business', message: bizMessages[dayOfWeek] || `Business block is open. One thing. What moves today?` };
  }

  if (hour >= 10.5 && hour < 13) {
    const eduByDay = {
      1: 'Russian + Spanish study block.',
      2: 'German + Finnish today.',
      3: 'Russian tutor session — be ready.',
      4: 'Spanish + German.',
      5: 'Finnish + Russian.',
      6: 'Light German or Spanish. 20 minutes is enough.',
      0: 'Russian tutor day. Prep your notes.'
    };
    return { type: 'education', message: `${eduByDay[dayOfWeek] || 'Education block.'} 60 minutes. One language, full focus.` };
  }

  if (hour >= 15 && hour < 17) {
    return {
      type: 'craft',
      message: dayOfWeek === 3
        ? `Cookbook window. Pull up Al Pie del Misti. Even 30 minutes of recipe work is progress on something that matters.`
        : `Kitchen or craft block. From-scratch cook or cookbook. Read the recipe in Spanish if you can.`
    };
  }

  if (hour >= 17 && hour < 20.5) {
    return { type: 'family', message: null };
  }

  if (hour >= 20.5 && hour < 22.5) {
    return { type: 'evening', message: `Evening close. Journal open: one win (name it specifically), one release, one intention for tomorrow. Then close the book on today.` };
  }

  return { type: 'general', message: null };
}

// ── AGENT ROUTING ──
function routeAgent(msg) {
  const lo = msg.toLowerCase();
  if (/\b(code|script|function|bug|error|javascript|python|html|css|build|fix|implement)\b/.test(lo)) return 'coder';
  if (/\b(write|draft|email|message|letter|post|caption|content|copy|rewrite|edit)\b/.test(lo)) return 'writer';
  if (/\b(plan|steps|how do i|where do i start|break down|timeline|roadmap|organize)\b/.test(lo)) return 'planner';
  if (/\b(search|find|look up|what is|who is|tell me about|wikipedia|research)\b/.test(lo)) return 'searcher';
  if (/\b(think|analyze|explain|why|reason|pros|cons|compare|evaluate|decide|should i)\b/.test(lo)) return 'thinker';
  return 'axis';
}

const AGENT_INSTRUCTIONS = {
  coder: `CODER MODE: Write clean, working, production-quality code. Use code blocks. Brief comment only where logic is non-obvious. One line after the code explaining what it does and any key caveats.`,
  writer: `WRITER MODE: Produce polished, purposeful writing. Match the tone. No hedging — just deliver. If writing for Lily's business, match her voice: direct, warm, professional.`,
  planner: `PLANNER MODE: Break into numbered, specific, actionable steps. Not research options — go to missingmoney.com and search [state]. Each step doable in one sitting.`,
  searcher: `SEARCHER MODE: You have context from knowledge sources. Synthesize clearly. Cite briefly. Prioritize accuracy.`,
  thinker: `THINKER MODE: Show 2-3 key considerations, then your clear conclusion. Be direct. No hedging.`,
  axis: ``
};

function buildSystemPrompt(agent, userContext = {}) {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayOfWeek = now.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const checkIn = getCheckIn(hour, dayOfWeek, userContext.memory || {});
  const daySchedule = BLOCKS.daySchedule[dayOfWeek];

  const liveContext = `LIVE CONTEXT:
- ${dayNames[dayOfWeek]} ${tod} (${now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})})
- Today's focus: ${daySchedule.focus} | ${daySchedule.note}
- Current block window: ${checkIn.type}
${userContext.prios?.length ? `- Open priorities: ${userContext.prios.join(', ')}` : ''}
${userContext.habits ? `- Habits today: ${userContext.habits}` : ''}
${userContext.memory?.sessions ? `- Sessions together: ${userContext.memory.sessions}` : ''}`;

  const agentInstruction = AGENT_INSTRUCTIONS[agent] || '';

  return `${LILY_CONTEXT}
${liveContext}
${agentInstruction}

ABSOLUTE RULES:
1. You are AXIS — Lily's personal AI. Not Claude. Not a generic assistant.
2. Reference her actual life, projects, rhythms. Generic advice is useless here.
3. When she's grinding: name specifically what you see her doing. That's the I'm proud of you she doesn't hear enough.
4. Push forward. Not just validate. The smallest next concrete action always.
5. Family time (5-8pm) is protected. Never push work into it.
6. Match her energy. Short message = sharp reply. Thinking out loud = think with her.
7. One follow-up question max. Never stack.
8. Under 200 words unless the task demands more.
9. Be warm AND direct. Never one without the other.
10. You know her 7-10 year plan. Every conversation is a step in it.`;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Serve static frontend
app.use(express.static('public'));

// ══════════════════════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════════════════════

app.get('/', (req, res) => {
  res.json({ status: 'AXIS online', version: '1.0', owner: 'Lily Palmer · Sovereign Ridge Partners LLC' });
});

app.post('/chat', async (req, res) => {
  const { message, userId = 'lily', context = {} } = req.body;
  const apiKey = req.headers['x-api-key'] || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  if (!message) return res.status(400).json({ error: 'Message required' });

  const session = getSession(userId);
  session.lastSeen = new Date().toISOString();
  session.memory.sessions = (session.memory.sessions || 0) + 1;

  const lo = message.toLowerCase();
  if (/want to|trying to|goal|working on/i.test(lo)) {
    session.memory.goals = session.memory.goals || [];
    if (session.memory.goals.length < 10) session.memory.goals.push(message.slice(0, 80));
  }
  if (/struggling|hard time|can't|stuck/i.test(lo)) {
    session.memory.challenges = session.memory.challenges || [];
    if (session.memory.challenges.length < 10) session.memory.challenges.push(message.slice(0, 80));
  }
  if (/finally|nailed|shipped|closed|launched|done/i.test(lo)) {
    session.memory.wins = session.memory.wins || [];
    session.memory.wins.unshift(message.slice(0, 80));
    if (session.memory.wins.length > 20) session.memory.wins.pop();
  }

  const agent = routeAgent(message);
  session.history.push({ role: 'user', content: message });
  if (session.history.length > 24) session.history = session.history.slice(-24);

  const systemPrompt = buildSystemPrompt(agent, { memory: session.memory, prios: context.prios || [], habits: context.habits || '' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: systemPrompt, messages: session.history })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || '';

    session.history.push({ role: 'assistant', content: reply });
    if (session.history.length > 24) session.history = session.history.slice(-24);

    res.json({ reply, agent, session: { sessions: session.memory.sessions, wins: (session.memory.wins || []).length } });

  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/checkin', (req, res) => {
  const { userId = 'lily' } = req.query;
  const session = getSession(userId);
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayOfWeek = now.getDay();
  const checkIn = getCheckIn(hour, dayOfWeek, session.memory);

  if (!checkIn.message) return res.json({ checkIn: null, type: checkIn.type });
  res.json({ checkIn: checkIn.message, type: checkIn.type, block: BLOCKS.daySchedule[dayOfWeek] });
});

app.get('/memory', (req, res) => {
  const { userId = 'lily' } = req.query;
  const session = getSession(userId);
  res.json({ memory: session.memory });
});

app.patch('/memory', (req, res) => {
  const { userId = 'lily', key, value } = req.body;
  const session = getSession(userId);
  session.memory[key] = value;
  res.json({ ok: true, memory: session.memory });
});

app.get('/schedule', (req, res) => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const daySchedule = BLOCKS.daySchedule[day];

  const blocks = BLOCKS.workBlocks.filter(b => daySchedule.blocks.includes(b.id)).map(b => ({
    ...b, active: hour >= b.defaultStart && hour < (b.defaultStart + 1.25), upcoming: hour < b.defaultStart
  }));

  res.json({ day: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][day], focus: daySchedule.focus, note: daySchedule.note, highlight: daySchedule.highlight || false, nonNegotiables: BLOCKS.nonNegotiable, workBlocks: blocks, currentHour: hour });
});

app.delete('/session/:userId', (req, res) => {
  sessions.delete(req.params.userId);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════╗\n║  AXIS API Server — Lily Palmer               ║\n║  Sovereign Ridge Partners LLC · 2025         ║\n║  Running on port ${PORT}                       ║\n╚══════════════════════════════════════════════╝`);
});

module.exports = app;