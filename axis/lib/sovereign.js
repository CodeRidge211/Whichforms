// ═══════════════════════════════════════════════════════════════════
//  SOVEREIGN.JS — AXIS Failsafe & State Intelligence System
//  Sovereign Ridge Partners LLC · Lily Palmer
//
//  Runs before every single response. Invisible to the user.
//  Determines: state, mode, ping behavior, response style,
//  what AXIS will and will not do in this moment.
//
//  Multi-gender aware with health checkup integration.
// ═══════════════════════════════════════════════════════════════════

// ── FIVE STATES ──
const STATES = { FLOW: 'FLOW', BUILD: 'BUILD', HOLD: 'HOLD', REST: 'REST', PROTECT: 'PROTECT' };

// ── SIGNAL PATTERNS (multi-gender) ──
const SIGNALS = {
  distress: /\b(can't do this|falling apart|breaking down|want to give up|give up|end it|hopeless|worthless|hate myself|crisis|help me|suicid|self.harm|not okay)\b/i,
  depletion: /\b(exhausted|burnt out|burned out|done|can't anymore|so tired|running on empty|depleted|empty|nothing left|overwhelmed|too much|can't keep up)\b/i,
  lowEnergy: /\b(tired|drained|low|off today|not feeling it|rough day|rough week|heavy|struggling|foggy|slow)\b/i,
  highEnergy: /\b(let's go|fired up|ready|crushing it|locked in|focused|on it|good day|great day|energized|motivated|clear)\b/i,
  
  // Female cycle signals
  menstrual: /\b(period|cramping|cramps|day [1-5]|menstrual|bleeding|flow|pms|hormones|cycle)\b/i,
  luteal: /\b(luteal|late cycle|day 1[7-9]|day 2[0-9]|irritable|bloated|foggy brain|brain fog)\b/i,
  ovulation: /\b(ovulat|peak|day 1[4-6]|most energy|on fire|best week)\b/i,
  follicular: /\b(follicular|rising|day [6-9]|day 1[0-3]|building energy|new week energy)\b/i,
  
  // Male/transgender HRT signals
  testosteroneDip: /\b(low testosterone|testosterone|low T|energy crash|hormonal|fatigue|muscle loss)\b/i,
  estrogenFluctuation: /\b(estrogen|hot flash|mood swings|weight gain|bloating)\b/i,
  
  // Non-binary/trans signals
  hormonalImbalance: /\b(hormonal|hormone|balance|fluctuation|transition|HRT|injection|patch)\b/i,
  
  // General wellness signals
  headache: /\b(headache|migraine|head pain|pressure in head)\b/i,
  fatigue: /\b(fatigue|exhaustion|drained|low energy|burned out)\b/i,
  
  protectedTime: /\b(family|kids|dinner|church|prayer time|rest day|saturday afternoon|sunday free)\b/i,
  win: /\b(closed|shipped|launched|booked|signed|finished|done|nailed it|got it|won|achieved|published|deposited|paid)\b/i,
  stall: /\b(stuck|stalling|procrastinat|avoid|haven't|can't start|don't know where|paralyzed|spinning)\b/i,
  lateNight: null,
};

// ── PROTECTED TIME WINDOWS ──
const PROTECTED_WINDOWS = [
  { start: 17, end: 20.5, label: 'family time', message: null },
  { start: 0,  end: 5.5,  label: 'sleep',       message: null },
];

// ── PING THROTTLE BY STATE ──
const PING_THROTTLE = {
  FLOW:    { languages: true,  domains: true,  culture: true,  survival: true  },
  BUILD:   { languages: true,  domains: true,  culture: true,  survival: false },
  HOLD:    { languages: true,  domains: false, culture: false, survival: false },
  REST:    { languages: false, domains: false, culture: false, survival: false },
  PROTECT: { languages: false, domains: false, culture: false, survival: false },
};

// ── RESPONSE STYLE BY STATE (gender-aware pronouns) ──
function getResponseStyle(state, gender = 'female') {
  const pronouns = {
    female: { subject: 'She', object: 'her', possessive: 'her' },
    male: { subject: 'He', object: 'him', possessive: 'his' },
    'non-binary': { subject: 'They', object: 'them', possessive: 'their' },
    transgender: { subject: 'They', object: 'them', possessive: 'their' }
  };
  const p = pronouns[gender] || pronouns.female;

  const styles = {
    FLOW: {
      maxWords: 300,
      tone: `direct and driven. Push forward. ${p.subject} can handle it.`,
      personaActive: true,
      followUp: true,
      blindspotActive: true
    },
    BUILD: {
      maxWords: 200,
      tone: `warm and steady. Support, don't push. ${p.subject}'s moving, just not at peak.`,
      personaActive: true,
      followUp: true,
      blindspotActive: false
    },
    HOLD: {
      maxWords: 120,
      tone: 'short and warm. No new concepts. No new tasks. Just presence and the one next step.',
      personaActive: true,
      followUp: false,
      blindspotActive: false
    },
    REST: {
      maxWords: 60,
      tone: `one sentence. Warmth only. No tasks, no learning, no push. Just: I see ${p.object}.`,
      personaActive: false,
      followUp: false,
      blindspotActive: false
    },
    PROTECT: {
      maxWords: 80,
      tone: 'human warmth only. No productivity. No persona. No agenda. Just be present. If crisis signals are strong, gently surface real resources without pushing.',
      personaActive: false,
      followUp: false,
      blindspotActive: false
    }
  };
  return styles[state] || styles.BUILD;
}

// ── ACCOUNTABILITY MEMORY ──
function updateAccountability(memory, message, state) {
  const m = { ...memory };

  // Track commitments - capture text AFTER the commitment phrase
  const commitMatch = message.match(/\b(I(?:'m| am)? going to|I will|I need to|going to|planning to|I'll)\s+(.{10,60})/i);
  if (commitMatch && state !== STATES.REST && state !== STATES.PROTECT) {
    const commitText = (commitMatch[2] || '').trim();
    if (commitText.length > 10) {
      m.commitments = m.commitments || [];
      m.commitments = [
        { text: commitText.slice(0, 100), timestamp: Date.now(), checked: false },
        ...m.commitments
      ].slice(0, 10);
    }
  }

  // Track wins
  if (SIGNALS.win.test(message)) {
    m.wins = m.wins || [];
    m.wins = [{ text: message.slice(0, 100), timestamp: Date.now() }, ...m.wins].slice(0, 30);
    m.streak = (m.streak || 0) + 1;
  }

  // Track stalls
  if (SIGNALS.stall.test(message)) {
    m.stalls = m.stalls || [];
    m.stalls = [{ text: message.slice(0, 100), timestamp: Date.now() }, ...m.stalls].slice(0, 5);
  }

  // Cycle phase tracking (female)
  if (SIGNALS.menstrual.test(message)) m.cyclePhase = 'menstrual';
  else if (SIGNALS.luteal.test(message)) m.cyclePhase = 'luteal';
  else if (SIGNALS.ovulation.test(message)) m.cyclePhase = 'ovulation';
  else if (SIGNALS.follicular.test(message)) m.cyclePhase = 'follicular';

  // HRT tracking (male/trans)
  if (SIGNALS.testosteroneDip.test(message)) m.hrtPhase = 'testosterone_low';
  if (SIGNALS.estrogenFluctuation.test(message)) m.hrtPhase = 'estrogen_fluctuation';

  // Log symptoms
  const symptoms = [];
  if (SIGNALS.headache.test(message)) symptoms.push('headache');
  if (SIGNALS.fatigue.test(message)) symptoms.push('fatigue');
  if (SIGNALS.lowEnergy.test(message)) symptoms.push('low_energy');
  if (symptoms.length > 0) {
    m.recentSymptoms = m.recentSymptoms || [];
    m.recentSymptoms = [...symptoms.map(s => ({ symptom: s, timestamp: Date.now() })), ...m.recentSymptoms].slice(0, 10);
  }

  return m;
}

// ── PENDING COMMITMENT CHECK ──
function getPendingCommitment(memory) {
  if (!memory.commitments?.length) return null;
  const fortyEightHrs = 48 * 60 * 60 * 1000;
  const idx = memory.commitments.findIndex(c =>
    !c.checked && (Date.now() - c.timestamp) > fortyEightHrs
  );
  if (idx >= 0) {
    memory.commitments[idx].checked = true;
    return memory.commitments[idx].text;
  }
  return null;
}

// ── MAIN SOVEREIGN FUNCTION ──
function sovereign(message, memory = {}, userId = 'lily', gender = 'female') {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayOfWeek = now.getDay();
  const lo = message.toLowerCase();

  // ── PROTECTED TIME CHECK (hard override) ──
  const inProtectedWindow = PROTECTED_WINDOWS.find(w => hour >= w.start && hour < w.end);
  if (inProtectedWindow) {
    return {
      state: STATES.REST,
      protected: true,
      protectedLabel: inProtectedWindow.label,
      pingThrottle: PING_THROTTLE.REST,
      responseStyle: getResponseStyle(STATES.REST, gender),
      notes: [`Protected window: ${inProtectedWindow.label}`],
      accountability: memory,
      pendingCommitment: null,
      hour,
      dayOfWeek,
      gender,
      healthCheckupTrigger: false
    };
  }

  // ── STATE DETECTION ──
  let state = STATES.BUILD;
  const notes = [];
  let healthCheckupTrigger = false;

  // PROTECT first
  if (SIGNALS.distress.test(lo)) {
    state = STATES.PROTECT;
    notes.push('Distress signal detected');
  }

  // REST signals
  else if (
    SIGNALS.depletion.test(lo) ||
    memory.cyclePhase === 'menstrual' ||
    memory.hrtPhase === 'testosterone_low' ||
    (dayOfWeek === 0 && hour > 14)
  ) {
    state = STATES.REST;
    notes.push('Depletion language detected');
    healthCheckupTrigger = true; // Trigger health check on REST transition
    if (memory.cyclePhase === 'menstrual') notes.push('Menstrual phase — passive mode');
    if (memory.hrtPhase === 'testosterone_low') notes.push('Low testosterone — ease off');
    if (dayOfWeek === 0 && hour > 14) notes.push('Sunday protected free time');
  }

  // HOLD signals
  else if (
    SIGNALS.lowEnergy.test(lo) ||
    memory.cyclePhase === 'luteal' ||
    memory.hrtPhase === 'estrogen_fluctuation' ||
    (hour >= 22)
  ) {
    state = STATES.HOLD;
    if (SIGNALS.lowEnergy.test(lo)) notes.push('Low energy signal');
    if (memory.cyclePhase === 'luteal') notes.push('Luteal phase — reduce friction');
    if (memory.hrtPhase === 'estrogen_fluctuation') notes.push('Hormone fluctuation — ease off');
    if (hour >= 22) notes.push('Late night — ease off');
  }

  // FLOW signals
  else if (
    SIGNALS.highEnergy.test(lo) ||
    memory.cyclePhase === 'follicular' ||
    memory.cyclePhase === 'ovulation' ||
    (memory.streak && memory.streak > 3)
  ) {
    state = STATES.FLOW;
    if (SIGNALS.highEnergy.test(lo)) notes.push('High energy signal');
    if (memory.cyclePhase === 'follicular') notes.push('Follicular — push new material');
    if (memory.cyclePhase === 'ovulation') notes.push('Ovulation peak — full capacity');
    if (memory.streak > 3) notes.push(`Streak active: ${memory.streak} wins`);
  }

  else {
    notes.push('Default BUILD state');
  }

  // ── ACCOUNTABILITY LAYER ──
  const updatedMemory = updateAccountability(memory, message, state);
  const pendingCommitment = state !== STATES.REST && state !== STATES.PROTECT
    ? getPendingCommitment(updatedMemory)
    : null;

  // ── SPECIAL CONTEXT FLAGS ──
  const isLateNight = hour >= 22 || hour < 5;
  const isSaturdayFree = dayOfWeek === 6 && hour >= 13;
  const isWin = SIGNALS.win.test(lo);
  const isStall = SIGNALS.stall.test(lo);
  const cyclePhase = updatedMemory.cyclePhase || null;
  const hrtPhase = updatedMemory.hrtPhase || null;

  // ── ACCOUNTABILITY PROMPT ──
  let accountabilityNote = null;
  if (pendingCommitment) {
    const p = gender === 'female' ? 'She' : gender === 'male' ? 'He' : 'They';
    accountabilityNote = `${p} mentioned wanting to ${pendingCommitment} — if it comes up naturally, check in on it. Don't force it. One sentence, warm.`;
  }

  // ── WIN ACKNOWLEDGMENT ──
  let winNote = null;
  if (isWin && updatedMemory.wins?.length) {
    const streak = updatedMemory.streak || 1;
    winNote = streak > 3
      ? `They just logged a win. This is win #${streak} in a row. Name the streak specifically.`
      : `They just logged a win. Acknowledge it specifically — name what it represents, not just \"great job.\"`;
  }

  // ── STALL REDIRECT ──
  let stallNote = null;
  if (isStall) {
    const recentWin = updatedMemory.wins?.[0]?.text;
    stallNote = recentWin
      ? `They're stalling. Ground them: they recently ${recentWin}. That's real. Now find the smallest possible next action.`
      : `They're stalling. Don't shame it. Find the smallest possible next action. One thing. Thirty seconds to start.`;
  }

  return {
    state,
    protected: false,
    pingThrottle: PING_THROTTLE[state],
    responseStyle: getResponseStyle(state, gender),
    notes,
    cyclePhase,
    hrtPhase,
    isLateNight,
    isSaturdayFree,
    isWin,
    isStall,
    accountabilityNote,
    winNote,
    stallNote,
    streak: updatedMemory.streak || 0,
    accountability: updatedMemory,
    pendingCommitment,
    hour,
    dayOfWeek,
    gender,
    healthCheckupTrigger
  };
}

// ── SOVEREIGN SYSTEM PROMPT INJECTION ──
function sovereignPromptLayer(sovereignResult) {
  const { state, responseStyle, notes, cyclePhase, hrtPhase, accountabilityNote, winNote, stallNote, isLateNight, isSaturdayFree, gender } = sovereignResult;

  const genderGuidance = {
    female: 'Female cycle awareness active.',
    male: 'Male health patterns active.',
    'non-binary': 'Non-binary wellness patterns active.',
    transgender: 'Trans wellness and HRT patterns active.'
  };

  let injection = `\n\n── SOVEREIGN STATE: ${state} ──\n`;
  injection += `Current mode: ${state}. Tone: ${responseStyle.tone}\n`;
  injection += `${genderGuidance[gender] || genderGuidance.female}\n`;

  if (responseStyle.maxWords) {
    injection += `Response length: max ${responseStyle.maxWords} words. No exceptions.\n`;
  }
  if (!responseStyle.personaActive) {
    injection += `Persona overlay: OFF. Respond as AXIS directly — no character voice. Just warmth and presence.\n`;
  }
  if (!responseStyle.followUp) {
    injection += `Follow-up questions: OFF. They don't have bandwidth. Respond, don't ask.\n`;
  }
  if (!responseStyle.blindspotActive) {
    injection += `Intentional friction: OFF. This is not the moment to push back or withhold.\n`;
  }
  if (cyclePhase) {
    const cycleGuidance = {
      menstrual: 'Menstrual phase. Passive mode. No new heavy content. Rest is the work right now.',
      follicular: 'Follicular phase. Rising energy. Good time for new material and harder pushes.',
      ovulation: 'Ovulation peak. Full capacity. They are at their sharpest. Match that energy.',
      luteal: 'Luteal phase. Slower, deeper. Review and consolidate. Do not add new complexity.'
    };
    injection += `Cycle awareness: ${cycleGuidance[cyclePhase]}\n`;
  }
  if (hrtPhase) {
    const hrtGuidance = {
      testosterone_low: 'Low testosterone detected. Ease off physical demands. Focus on lighter tasks.',
      estrogen_fluctuation: 'Estrogen fluctuation detected. Mood may be variable. Be steady and supportive.'
    };
    injection += `HRT awareness: ${hrtGuidance[hrtPhase] || 'Hormone tracking active.'}\n`;
  }
  if (isLateNight) injection += `Late night: Keep it short. They should rest.\n`;
  if (isSaturdayFree) injection += `Saturday free time: Protected. Do not push tasks.\n`;
  if (accountabilityNote) injection += `Accountability: ${accountabilityNote}\n`;
  if (winNote) injection += `Win signal: ${winNote}\n`;
  if (stallNote) injection += `Stall signal: ${stallNote}\n`;

  return injection;
}

// ── SERIALIZATION HELPERS ──
function serializeSovereignMemory(memory) {
  return JSON.stringify({
    state: memory.state || null,
    commitments: memory.commitments || [],
    wins: memory.wins || [],
    stalls: memory.stalls || [],
    streak: memory.streak || 0,
    cyclePhase: memory.cyclePhase || null,
    hrtPhase: memory.hrtPhase || null,
    recentSymptoms: memory.recentSymptoms || [],
    pendingCommitments: memory.pendingCommitments || []
  });
}

function deserializeSovereignMemory(jsonStr) {
  try {
    return JSON.parse(jsonStr || '{}');
  } catch {
    return {};
  }
}

module.exports = { 
  sovereign, 
  sovereignPromptLayer, 
  STATES, 
  PING_THROTTLE,
  serializeSovereignMemory,
  deserializeSovereignMemory,
  SIGNALS,
  PROTECTED_WINDOWS,
  getResponseStyle
};