// ═══════════════════════════════════════════════════════
//  AXIS FRONTEND — API CONFIG
//  Replace the direct Anthropic call in your HTML with this
//  Paste this into your axis HTML <script> section
// ═══════════════════════════════════════════════════════

// 🔧 SET THIS after you deploy to Railway
const API_BASE = 'https://your-railway-url.up.railway.app';
// For local dev: const API_BASE = 'http://localhost:3000';

// ── MAIN CHAT CALL (replaces callClaude / callAI) ──
async function callAxis(userMsg, contextData = {}) {
  // Build context from live app data
  const prios = DB.get('prios', []).filter(p => !p.d).map(p => p.text);
  const habits = DB.get('habits', []);
  const doneHabits = habits.filter(h => (h.days || {})[todayKey()]).length;
  const health = DB.get('health_' + todayKey(), { water: 0, steps: 0 });

  const context = {
    prios,
    habits: `${doneHabits}/${habits.length} done today · water: ${health.water || 0}/8 · steps: ${(health.steps || 0).toLocaleString()}`,
    ...contextData
  };

  const resp = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMsg,
      userId: 'lily',
      context
    })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Server error ' + resp.status);
  }

  const data = await resp.json();
  return data.reply;
}

// ── PROACTIVE CHECK-IN (call on app open) ──
async function fetchCheckIn() {
  try {
    const resp = await fetch(`${API_BASE}/checkin?userId=lily`);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.checkIn || null;
  } catch { return null; }
}

// ── TODAY'S SCHEDULE FROM SERVER ──
async function fetchSchedule() {
  try {
    const resp = await fetch(`${API_BASE}/schedule`);
    if (!resp.ok) return null;
    return await resp.json();
  } catch { return null; }
}

// ── HOW TO WIRE INTO EXISTING sendMsg ──
// In your sendMsg function, replace the fetch to Anthropic with:
//
//   const reply = await callAxis(txt);
//
// On app init, add:
//
//   const checkIn = await fetchCheckIn();
//   if (checkIn) { addMsg(checkIn, false, 'push'); speak(checkIn); }
//
// That's it. Your server handles everything else.