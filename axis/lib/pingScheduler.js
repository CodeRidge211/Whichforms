const cron = require('node-cron');

class PingScheduler {
  constructor(prisma) { 
    this.prisma = prisma; 
    this.userSchedules = new Map(); 
    this.wsConnections = new Map();
    this.userSovereignState = new Map();
  }

  start() { 
    cron.schedule('* * * * *', async () => { await this.processScheduledPings(); }); 
    cron.schedule('0 * * * *', async () => { await this.adaptToHabits(); }); 
    console.log('Ping scheduler started'); 
  }

  startUserSchedule(userId, ws) { 
    this.wsConnections.set(userId, ws); 
  }

  updateSovereignState(userId, sovereignState) {
    this.userSovereignState.set(userId, sovereignState);
  }

  getSovereignState(userId) {
    return this.userSovereignState.get(userId) || null;
  }

  isPingAllowed(userId, pingCategory) {
    const state = this.getSovereignState(userId);
    if (!state || !state.pingThrottle) return true;
    return state.pingThrottle[pingCategory] ?? true;
  }

  generateDailySchedule(userId, startTime = '07:30', endTime = '21:00') {
    const pings = [];
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMin = startH * 60 + startM, endMin = endH * 60 + endM;
    const totalDuration = endMin - startMin;
    const interval = Math.floor(totalDuration / 26);
    for (let i = 0; i < 27; i++) {
      const totalMin = startMin + Math.round(i * (totalDuration / 26));
      const h = Math.floor(totalMin / 60), m = totalMin % 60;
      const timeStr = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
      const personas = ['NOVA','JARVIS','SAGE','CLEO','ATLAS','VEGA','IRON','WREN','DUSK','BOLT'];
      const slot = Math.floor(i / 3);
      pings.push({ time: timeStr, persona: personas[slot % personas.length], index: i });
    }
    return pings;
  }

  async sendPing(userId, content, persona = 'NOVA', pingCategory = 'domains') {
    if (!this.isPingAllowed(userId, pingCategory)) {
      console.log('[Sovereign] Ping throttled for ' + userId + ' (' + pingCategory + ')');
      return false;
    }

    const ws = this.wsConnections.get(userId);
    if (ws && ws.readyState === 1) { ws.send(JSON.stringify({ type: 'ping', content, persona })); }
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { preferences: true } });
    if (user?.preferences?.smsEnabled && user.tier !== 'free') {
      const { TwilioService } = require('./twilioService');
      const twilio = new TwilioService(); twilio.initialize();
      if (user.phone) await twilio.sendSMS(user.phone, '[AXIS] ' + content);
    }
    return true;
  }

  async processScheduledPings() {
    const now = new Date(), hour = now.getHours(), min = now.getMinutes();
    const timeStr = String(hour).padStart(2,'0') + ':' + String(min).padStart(2,'0');
    for (const [userId, schedule] of this.userSchedules) {
      const ping = schedule.find(p => p.time === timeStr);
      if (ping) { 
        const category = this.getPingCategory(ping.persona);
        if (this.isPingAllowed(userId, category)) {
          await this.sendPing(userId, this.getPingContent(ping), ping.persona, category);
        }
      }
    }
  }

  getPingCategory(persona) {
    const categoryMap = {
      'NOVA': 'languages',
      'JARVIS': 'domains',
      'SAGE': 'culture',
      'CLEO': 'domains',
      'ATLAS': 'domains',
      'VEGA': 'culture',
      'IRON': 'survival',
      'WREN': 'culture',
      'DUSK': 'culture',
      'BOLT': 'survival'
    };
    return categoryMap[persona] || 'domains';
  }

  getPingContent(ping) {
    const morning = ['Rise and shine! Your most productive hours are ahead.', 'Good morning! What is your focus today?', 'Start strong. What matters most this morning?'];
    const mid = ['Checking in. How is your momentum?', 'Midday check-in. Stay aligned with your goals.', 'Focus check: Are you on track?'];
    const afternoon = ['Afternoon pulse. Any afternoon blockers?', 'Keep pushing. What is left on your priority list?', 'Stay sharp. One thing at a time.'];
    const evening = ['Wind down mode. Review your wins?', 'Evening reflection: What made progress today?', 'Last push. What can you complete tonight?'];
    const h = parseInt(ping.time.split(':')[0]);
    const key = h < 12 ? 'morning' : h < 17 ? 'mid' : h < 20 ? 'afternoon' : 'evening';
    const contentMap = { morning: morning, mid: mid, afternoon: afternoon, evening: evening };
    return contentMap[key][ping.index % 3];
  }

  async adaptToHabits() { console.log('Adapting to user habits...'); }
}

module.exports = { PingScheduler };
