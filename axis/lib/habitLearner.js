class HabitLearner {
  constructor(prisma) { this.prisma = prisma; this.learningPeriodDays = 21; }
  async recordInteraction(userId, type, data = {}) {
    const key = `${type}_${data.persona || 'general'}`;
    let habit = await this.prisma.habit.findUnique({ where: { userId_action: { userId, action: key } } });
    if (!habit) habit = await this.prisma.habit.create({ data: { userId, action: key, frequency: 'daily' } });
    const weekNum = this.getWeekNumber(habit.createdAt);
    const weekData = { date: new Date().toISOString(), hour: new Date().getHours(), completed: data.completed || false, responseTime: data.responseTime || null, persona: data.persona, week: weekNum };
    const updateData = {}; updateData[`week${weekNum}Data`] = weekData;
    const allData = [habit.week1Data, habit.week2Data, habit.week3Data, habit.week4Data].filter(Boolean).flat();
    updateData.completionRate = allData.length > 0 ? allData.filter(d => d.completed).length / allData.length : 0;
    await this.prisma.habit.update({ where: { id: habit.id }, data: updateData });
    if (data.timestamp) { const time = new Date(data.timestamp).toTimeString().slice(0, 5); await this.prisma.habit.update({ where: { id: habit.id }, data: { typicalTime: time } }); }
  }
  getWeekNumber(createdAt) { const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000)); return Math.min(4, Math.floor(days / 7) + 1); }
  async getInsights(userId) {
    const habits = await this.prisma.habit.findMany({ where: { userId } });
    const interactions = await this.prisma.interaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
    const insights = { learningProgress: this.calculateLearningProgress(habits), optimalPingTimes: this.findOptimalTimes(habits), preferredPersonas: this.analyzePersonaPreferences(interactions), languagePatterns: this.analyzeLanguagePatterns(interactions), recommendations: [] };
    insights.recommendations = this.generateRecommendations(insights, habits);
    return insights;
  }
  calculateLearningProgress(habits) { if (habits.length === 0) return { week: 0, percentComplete: 0, ready: false }; const oldest = habits.reduce((o, h) => new Date(h.createdAt) < new Date(o.createdAt) ? h : oldest); const days = Math.floor((Date.now() - new Date(oldest.createdAt).getTime()) / (24 * 60 * 60 * 1000)); const week = Math.min(4, Math.floor(days / 7) + 1); return { week, percentComplete: Math.round(Math.min(100, (days / this.learningPeriodDays) * 100)), daysRemaining: Math.max(0, this.learningPeriodDays - days), ready: days >= this.learningPeriodDays }; }
  findOptimalTimes(habits) { const timeResponses = {}; for (const habit of habits) { const weekData = [habit.week1Data, habit.week2Data, habit.week3Data, habit.week4Data].filter(Boolean); for (const data of weekData) { if (data.hour !== undefined) { if (!timeResponses[data.hour]) timeResponses[data.hour] = { responses: 0, total: 0 }; timeResponses[data.hour].total++; if (data.completed) timeResponses[data.hour].responses++; } } } const hourStats = Object.entries(timeResponses).map(([h, s]) => ({ hour: parseInt(h), responseRate: s.responses / s.total, sampleSize: s.total })).sort((a, b) => b.responseRate - a.responseRate); return { bestHours: hourStats.slice(0, 3).map(h => h.hour), worstHours: hourStats.slice(-2).map(h => h.hour), byHour: hourStats }; }
  analyzePersonaPreferences(interactions) { const counts = {}; for (const i of interactions) { if (i.persona) counts[i.persona] = (counts[i.persona] || 0) + 1; } const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a).map(([p, c]) => ({ persona: p, count: c })); const total = sorted.reduce((s, p) => s + p.count, 0); return { breakdown: sorted.map(p => ({ ...p, percentage: total > 0 ? Math.round((p.count / total) * 100) : 0 })), preferred: sorted.length > 0 ? sorted[0].persona : 'JARVIS' }; }
  analyzeLanguagePatterns(interactions) { const langs = { en: 0, ru: 0, de: 0, es: 0, zh: 0, fi: 0 }; for (const i of interactions) { if (i.content) { if (/[\u0400-\u04FF]/.test(i.content)) langs.ru++; else if (/[\u4E00-\u9FFF]/.test(i.content)) langs.zh++; else if (/[äöüß]/.test(i.content.toLowerCase())) langs.de++; else if (/[ñáéíóú]/.test(i.content.toLowerCase())) langs.es++; else langs.en++; } } return langs; }
  generateRecommendations(insights, habits) { const recs = []; if (insights.learningProgress.week === 1) recs.push({ type: 'setup', message: 'Learning your patterns. Keep using AXIS naturally.' }); if (insights.learningProgress.week === 2) recs.push({ type: 'progress', message: 'I\'m starting to understand your rhythms.' }); if (insights.learningProgress.ready) recs.push({ type: 'ready', message: 'Adaptation complete! Your personalized experience is ready.' }); if (insights.optimalPingTimes.bestHours.length > 0) recs.push({ type: 'timing', message: `You respond best to pings around ${insights.optimalPingTimes.bestHours.join(', ')}:00.` }); if (insights.preferredPersonas.preferred) recs.push({ type: 'persona', message: `You engage most with ${insights.preferredPersonas.preferred}.` }); return recs; }
  async getAdaptedBehavior(userId) { const insights = await this.getInsights(userId); return { pingTimes: insights.optimalPingTimes.bestHours, primaryPersona: insights.preferredPersonas.preferred, language: 'en', adaptationReady: insights.learningProgress.ready, learningProgress: insights.learningProgress }; }
}
module.exports = { HabitLearner };
