// ═══════════════════════════════════════════════════════════════════
//  HEALTH CHECKUP.JS — AXIS Wellness Popup System
//  Multi-gender health tracking with weekly and state-change triggers
// ═══════════════════════════════════════════════════════════════════

// Health checkup questions by gender
const HEALTH_QUESTIONS = {
  female: {
    sleep: ['How did you sleep last night?', 'Sleep quality:', 'hours slept:'],
    mood: ['How are you feeling overall?', 'Mood (1-10):', 'Emotional state:'],
    energy: ['Energy level right now?', 'Energy (1-10):', 'How tired do you feel?'],
    symptoms: ['Any symptoms to log?', 'Symptoms:', 'Headache|Fatigue|Nausea| cramps|bloating|mood swings'],
    cycle: ['What day of your cycle are you on?', 'Cycle day:', 'Period or spotting today?']
  },
  male: {
    sleep: ['How did you sleep last night?', 'Sleep quality:', 'hours slept:'],
    mood: ['How are you feeling overall?', 'Mood (1-10):', 'Stress level:'],
    energy: ['Energy level right now?', 'Energy (1-10):', 'How tired do you feel?'],
    symptoms: ['Any symptoms to log?', 'Symptoms:', 'Headache|Fatigue|muscle soreness|digestive|restless'],
    hormonal: ['Any hormonal changes noted?', 'Hormonal:', 'Libido|energy spikes|mood changes']
  },
  'non-binary': {
    sleep: ['How did you sleep last night?', 'Sleep quality:', 'hours slept:'],
    mood: ['How are you feeling overall?', 'Mood (1-10):', 'Emotional state:'],
    energy: ['Energy level right now?', 'Energy (1-10):', 'How tired do you feel?'],
    symptoms: ['Any symptoms to log?', 'Symptoms:', 'Headache|Fatigue|nausea|mood swings|body aches'],
    hormonal: ['Any hormonal changes noted?', 'Hormonal:', ' testosterone|estrogen|changes']
  },
  transgender: {
    sleep: ['How did you sleep last night?', 'Sleep quality:', 'hours slept:'],
    mood: ['How are you feeling overall?', 'Mood (1-10):', 'Emotional state:'],
    energy: ['Energy level right now?', 'Energy (1-10):', 'How tired do you feel?'],
    symptoms: ['Any symptoms to log?', 'Symptoms:', 'Headache|Fatigue|nausea|hormonal fluctuations'],
    hrt: ['HRT-related notes?', 'Hormone status:', 'injection day|patch change|side effects']
  }
};

// Common wellness metrics
const WELLNESS_METRICS = {
  sleepQuality: ['excellent', 'good', 'fair', 'poor'],
  moodScale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  energyScale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  commonSymptoms: [
    'headache', 'fatigue', 'nausea', 'dizziness', 
    'muscle soreness', 'joint pain', 'brain fog',
    'anxiety', 'irritability', 'mood swings',
    'bloating', 'cramping', 'spotting'
  ]
};

// Frequency settings (milliseconds)
const CHECKUP_INTERVALS = {
  weekly: 7 * 24 * 60 * 60 * 1000,      // 7 days
  biweekly: 14 * 24 * 60 * 60 * 1000,   // 14 days
  monthly: 30 * 24 * 60 * 60 * 1000     // 30 days
};

class HealthCheckup {
  constructor(prisma) {
    this.prisma = prisma;
    this.lastCheckupTime = new Map(); // userId -> timestamp
  }

  // Get gender-specific questions
  getQuestions(gender = 'female') {
    return HEALTH_QUESTIONS[gender] || HEALTH_QUESTIONS.female;
  }

  // Build the health checkup popup content
  buildPopupContent(gender = 'female', triggerType = 'scheduled') {
    const questions = this.getQuestions(gender);
    const introText = triggerType === 'state_change' 
      ? 'AXIS noticed you might need a moment to check in. No pressure — just a quick wellness check.'
      : 'Weekly wellness check-in. How are you doing?';

    return {
      intro: introText,
      triggerType,
      questions: {
        sleep: {
          prompt: questions.sleep[0],
          options: WELLNESS_METRICS.sleepQuality,
          inputType: 'select'
        },
        mood: {
          prompt: questions.mood[0],
          scale: WELLNESS_METRICS.moodScale,
          inputType: 'slider'
        },
        energy: {
          prompt: questions.energy[0],
          scale: WELLNESS_METRICS.energyScale,
          inputType: 'slider'
        },
        symptoms: {
          prompt: questions.symptoms[0],
          options: WELLNESS_METRICS.commonSymptoms,
          inputType: 'multiSelect'
        },
        notes: {
          prompt: 'Anything else you want to track?',
          inputType: 'text'
        }
      },
      submitLabel: 'Save Check-in',
      skipLabel: 'Remind me later'
    };
  }

  // Check if health checkup should be triggered
  async shouldTriggerCheckup(userId) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      include: { preferences: true }
    });
    
    if (!user) return { trigger: false };

    const frequency = user.preferences?.healthCheckupFrequency || 'weekly';
    const interval = CHECKUP_INTERVALS[frequency] || CHECKUP_INTERVALS.weekly;
    
    // Check last checkup time
    const lastCheckup = await this.prisma.healthCheckup.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Check if user recently skipped (24-hour cooldown) - uses persisted lastSkippedAt
    if (user?.lastSkippedAt) {
      const skippedDiff = Date.now() - new Date(user.lastSkippedAt).getTime();
      if (skippedDiff < 24 * 60 * 60 * 1000) {
        return { trigger: false, reason: 'skipped_recently' };
      }
    }

    const now = Date.now();
    const timeSinceLastCheckup = lastCheckup 
      ? now - new Date(lastCheckup.createdAt).getTime()
      : interval + 1; // Force trigger if never done

    // Trigger if interval has passed
    if (timeSinceLastCheckup >= interval) {
      return { 
        trigger: true, 
        reason: 'scheduled',
        daysSinceLast: Math.floor(timeSinceLastCheckup / (24 * 60 * 60 * 1000))
      };
    }

    return { trigger: false, reason: null };
  }

  // Trigger health checkup on state transition to REST
  async onStateTransition(userId, oldState, newState) {
    if (newState === 'REST' && oldState !== 'REST') {
      // Create pending checkup notification
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const popupContent = this.buildPopupContent(user?.gender || 'female', 'state_change');
      
      return {
        triggered: true,
        type: 'state_change',
        popup: popupContent,
        message: 'Taking a moment to check in — how are you really doing?'
      };
    }
    return { triggered: false };
  }

  // Save health checkup response
  async saveCheckup(userId, responseData) {
    // Handle skipped checkups - don't create empty records
    if (responseData.skipped) {
      console.log(`[HealthCheckup] User ${userId} skipped checkup, deferring next trigger`);
      // Log the skip for tracking purposes
      await this.prisma.interaction.create({
        data: {
          userId,
          type: 'health_checkup_skipped',
          content: 'User skipped health checkup',
          metadata: JSON.stringify({
            triggeredBy: responseData.triggeredBy || 'unknown',
            skippedAt: new Date().toISOString()
          })
        }
      });
      // Persist skip timestamp to database so it survives server restarts
      try {
        await this.prisma.user.update({
          where: { id: userId },
          data: { lastSkippedAt: new Date() }
        });
      } catch (err) {
        console.log(`[HealthCheckup] Could not update lastSkippedAt for user ${userId}:`, err.message);
      }
      return null;
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const gender = user?.gender || 'female';

    const checkup = await this.prisma.healthCheckup.create({
      data: {
        userId,
        triggeredBy: responseData.triggeredBy || 'scheduled',
        sleepQuality: responseData.sleepQuality,
        moodLevel: responseData.moodLevel ? parseInt(responseData.moodLevel) : null,
        energyLevel: responseData.energyLevel ? parseInt(responseData.energyLevel) : null,
        symptoms: responseData.symptoms ? (Array.isArray(responseData.symptoms) ? responseData.symptoms.join(',') : responseData.symptoms) : null,
        cycleDay: responseData.cycleDay ? parseInt(responseData.cycleDay) : null,
        notes: responseData.notes,
        completedAt: new Date()
      }
    });

    // Log to Interaction table for trend analysis
    await this.prisma.interaction.create({
      data: {
        userId,
        type: 'health_checkup',
        content: JSON.stringify({
          sleepQuality: responseData.sleepQuality,
          moodLevel: responseData.moodLevel,
          energyLevel: responseData.energyLevel,
          symptoms: responseData.symptoms,
          triggeredBy: responseData.triggeredBy
        }),
        metadata: JSON.stringify({ 
          gender,
          cycleDay: responseData.cycleDay,
          wellnessTrend: this.calculateTrend(userId)
        })
      }
    });

    // Update last checkup time
    this.lastCheckupTime.set(userId, Date.now());

    return checkup;
  }

  // Calculate wellness trend from recent checkups
  async calculateTrend(userId) {
    const recentCheckups = await this.prisma.healthCheckup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (recentCheckups.length < 2) return 'insufficient_data';

    const avgMood = recentCheckups.reduce((sum, c) => sum + (c.moodLevel || 5), 0) / recentCheckups.length;
    const avgEnergy = recentCheckups.reduce((sum, c) => sum + (c.energyLevel || 5), 0) / recentCheckups.length;
    const recentAvg = (avgMood + avgEnergy) / 2;

    if (recentAvg >= 7) return 'improving';
    if (recentAvg >= 4) return 'stable';
    return 'declining';
  }

  // Get health insights for dashboard
  async getHealthInsights(userId) {
    const checkups = await this.prisma.healthCheckup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const trend = await this.calculateTrend(userId);
    const avgMood = checkups.length > 0 
      ? checkups.reduce((sum, c) => sum + (c.moodLevel || 0), 0) / checkups.filter(c => c.moodLevel).length 
      : null;
    const avgEnergy = checkups.length > 0
      ? checkups.reduce((sum, c) => sum + (c.energyLevel || 0), 0) / checkups.filter(c => c.energyLevel).length
      : null;

    // Symptom frequency analysis
    const symptomCounts = {};
    checkups.forEach(c => {
      if (c.symptoms) {
        c.symptoms.split(',').forEach(s => {
          const symptom = s.trim().toLowerCase();
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        });
      }
    });

    const topSymptoms = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, frequency: count }));

    return {
      totalCheckups: checkups.length,
      trend,
      averageMood: avgMood ? Math.round(avgMood * 10) / 10 : null,
      averageEnergy: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
      topSymptoms,
      lastCheckup: checkups[0] ? checkups[0].createdAt : null,
      checkupHistory: checkups.slice(0, 7).map(c => ({
        date: c.createdAt,
        sleepQuality: c.sleepQuality,
        moodLevel: c.moodLevel,
        energyLevel: c.energyLevel,
        symptoms: c.symptoms ? c.symptoms.split(',') : []
      }))
    };
  }
}

module.exports = { HealthCheckup, HEALTH_QUESTIONS, WELLNESS_METRICS, CHECKUP_INTERVALS };