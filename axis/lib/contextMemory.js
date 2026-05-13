// ═══════════════════════════════════════════════════════════════════
//  CONTEXT MEMORY — AXIS Self-Learning Context System
//  Extracts, stores, and retrieves persistent user context
//  so AXIS knows your situation without constant re-explanation
// ═══════════════════════════════════════════════════════════════════

class ContextMemory {
  constructor(prisma) {
    this.prisma = prisma;
    
    // Rate limiting: don't extract context more than once per 5 minutes per user
    this.lastExtractionTime = new Map(); // userId -> timestamp
    this.EXTRACTION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
    
    // Context decay: facts not used in 30+ days lose confidence
    this.DECAY_DAYS = 30;
    this.DECAY_THRESHOLD = 0.5; // Confidence floor after decay
    this.lastUsedAt = new Map(); // userId_category_key -> timestamp
    
    // Pattern matchers for context extraction (case-insensitive)
    this.extractors = {
      location: [
        { pattern: /i\s*(?:live|am based)\s*(?:in|at|near)\s*([a-zA-Z][a-zA-Z]*(?:\/?[a-zA-Z][a-zA-Z]*){0,2})/i, key: 'current_city', confidence: 0.8 },
        { pattern: /i\s*(?:just\s*)?(?:moved|migrated)\s*(?:to|from)\s*([a-zA-Z][a-zA-Z]*(?:\/?[a-zA-Z][a-zA-Z]*){0,2})/i, key: 'current_city', confidence: 0.7 },
        { pattern: /i\s*(?:work from home|remote(?:ly)?|wfh)/i, key: 'work_style', value: 'remote', confidence: 0.6 },
        { pattern: /i\s*(?:commute|driving)\s*(?:to|in)\s*(?:the\s*)?office/i, key: 'work_style', value: 'hybrid', confidence: 0.6 },
        { pattern: /i\s*live\s*(alone|with my partner|with my (?:wife|husband|girlfriend|boyfriend|family|roommate|parents))/i, key: 'living_situation', confidence: 0.7 },
      ],
      work: [
        // Match "I work as a software engineer" -> captures "software engineer"
        { pattern: /i\s*(?:work|working)\s*(?:as|at)\s*(?:a|an)?\s*(?:senior |junior |lead |principal )?(?:[a-z][a-z]+\s+)?([a-z]+\s*(?:engineer|developer|manager|designer|analyst|consultant|specialist|director|lead|architect|producer|writer|marketer|sales|recruiter|operations))/i, key: 'job_title', confidence: 0.8 },
        { pattern: /i\s*(?:run|own|co-founded|started)\s*(?:a|an)?\s*([a-zA-Z][a-zA-Z]*(?:\s*[a-zA-Z][a-zA-Z]*){0,3})(?:\s*(?:company|business|startup|firm))?/i, key: 'work_type', value: 'founder', confidence: 0.7 },
        { pattern: /i\s*(?:am\s*)?(?:freelance|contract)/i, key: 'work_type', value: 'freelance', confidence: 0.7 },
        { pattern: /(?:startup|saas|ecommerce|consulting|agency|product)/i, key: 'industry', confidence: 0.6 },
        { pattern: /my\s*(?:boss|team|manager|colleagues|co-workers|ceo|founder|cofounder)\s*(?:is|are|was|were)/i, key: 'has_team', value: 'true', confidence: 0.6 },
      ],
      project: [
        { pattern: /i\s*(?:am|have|working on|building|launching|shipping)\s*(?:a|an)?\s*(?:new|side)?\s*project\s*(?:called|named|for|on)?\s*([a-zA-Z][a-zA-Z]*(?:\s*[a-zA-Z]+){0,4})/i, key: 'current_project', confidence: 0.8 },
        { pattern: /i\s*(?:am|have|working on|building|launching|shipping)\s*(?:my|the|a|an)?\s*(?:startup|business|company|app|website|product|saas)/i, key: 'current_project', confidence: 0.7 },
        { pattern: /launch\s*(?:in|on|by)\s*(?:a|the)?\s*(?:week|month|day|january|february|march|april|may|june|july|august|september|october|november|december)/i, key: 'launch_timeline', confidence: 0.6 },
        { pattern: /beta\s*(?:launch|testing|user)/i, key: 'launch_timeline', value: 'beta', confidence: 0.7 },
      ],
      health: [
        { pattern: /(?:injury|broken|recovery|rehab|physical therapy)/i, key: 'health_status', value: 'injury_recovery', confidence: 0.7 },
        { pattern: /(?:pregnant|pregnancy|expecting)/i, key: 'health_status', value: 'pregnant', confidence: 0.8 },
        { pattern: /chronic\s*(?:pain|fatigue|condition)/i, key: 'health_status', value: 'chronic_condition', confidence: 0.7 },
      ],
      routine: [
        { pattern: /i\s*(?:wake up|get up|start)\s*(?:at|around)\s*(\d{1,2}:\d{2})/i, key: 'wake_time', confidence: 0.8 },
        { pattern: /i\s*(?:sleep|go to bed|turn in)\s*(?:at|around)\s*(\d{1,2}:\d{2})/i, key: 'sleep_time', confidence: 0.8 },
        { pattern: /i\s*(?:gym|workout|exercise|running|cycling)\s*(?:at|every|in|on)\s*(?:morning|evening|noon|night|weekends|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, key: 'exercise_routine', confidence: 0.7 },
      ],
      preference: [
        { pattern: /i\s*(?:prefer|hate|like|love|dislike|don't like)\s*(coffee|tea|espresso|lattes?)/i, key: 'coffee_preference', confidence: 0.7 },
        { pattern: /vegetarian|vegan|plant-based|keto|paleo|carnivore/i, key: 'diet', confidence: 0.7 },
      ],
      relationship: [
        { pattern: /i\s*(?:am\s*)?(married|engaged|divorced|single|in a relationship)/i, key: 'relationship_status', confidence: 0.8 },
        { pattern: /my\s*(?:wife|husband|partner|girlfriend|boyfriend|fianc[eé])\s*(?:is|was|wasn't|isn't)/i, key: 'relationship_status', value: 'in_relationship', confidence: 0.7 },
        { pattern: /i\s*have\s*(\d+)\s*(kids|children)/i, key: 'children', confidence: 0.8 },
      ],
    };
    
    // Context categories that are important to remember
    this.importantCategories = ['work', 'location', 'project', 'health', 'routine', 'relationship'];
  }

  // Extract context facts from a message
  extractContext(message) {
    const facts = [];
    
    for (const [category, extractors] of Object.entries(this.extractors)) {
      for (const extractor of extractors) {
        const match = message.match(extractor.pattern);
        if (match) {
          facts.push({
            category,
            key: extractor.key,
            value: extractor.value || (match[1] ? match[1].trim() : match[0].trim()),
            confidence: extractor.confidence,
            source: message.substring(Math.max(0, message.indexOf(match[0]) - 20), message.indexOf(match[0]) + match[0].length + 20),
          });
          break; // Only first match per category per message to avoid duplicates
        }
      }
    }
    
    return facts;
  }

  // Store extracted context facts
  async storeContext(userId, facts) {
    const stored = [];
    
    for (const fact of facts) {
      try {
        const existing = await this.prisma.contextEntry.findUnique({
          where: { userId_category_key: { userId, category: fact.category, key: fact.key } },
        });
        
        if (existing) {
          // Update if new fact has higher confidence or different value
          if (fact.confidence >= existing.confidence || fact.value !== existing.value) {
            const updated = await this.prisma.contextEntry.update({
              where: { id: existing.id },
              data: {
                value: fact.value,
                confidence: fact.confidence,
                source: fact.source,
                updatedAt: new Date(),
              },
            });
            stored.push(updated);
          }
        } else {
          // Create new entry
          const created = await this.prisma.contextEntry.create({
            data: {
              userId,
              category: fact.category,
              key: fact.key,
              value: fact.value,
              confidence: fact.confidence,
              source: fact.source,
            },
          });
          stored.push(created);
        }
      } catch (error) {
        console.error(`Failed to store context fact: ${error.message}`);
      }
    }
    
    return stored;
  }

  // Get all context for a user, formatted for system prompt injection
  async getContextForPrompt(userId, maxLength = 800) {
    const entries = await this.prisma.contextEntry.findMany({
      where: { userId },
      orderBy: [{ confidence: 'desc' }, { updatedAt: 'desc' }],
      take: 30, // Limit to 30 most recent/high confidence entries
    });
    
    if (entries.length === 0) return '';
    
    // Group by category
    const byCategory = {};
    for (const entry of entries) {
      if (!byCategory[entry.category]) byCategory[entry.category] = [];
      byCategory[entry.category].push(entry);
    }
    
    // Format for prompt
    let contextStr = '\n\n[USER CONTEXT - learned over time, refer to naturally when relevant]\n';
    
    for (const [category, entries] of Object.entries(byCategory)) {
      const facts = entries.map(e => `${e.key}: ${e.value}`).join('; ');
      contextStr += `${category}: ${facts}\n`;
    }
    
    // Truncate if too long
    if (contextStr.length > maxLength) {
      contextStr = contextStr.substring(0, maxLength) + '\n...'; // Truncate but indicate more exists
    }
    
    return contextStr;
  }

  // Get specific context category
  async getContextByCategory(userId, category) {
    return this.prisma.contextEntry.findMany({
      where: { userId, category },
      orderBy: { confidence: 'desc' },
    });
  }

  // Update context manually (from user feedback or explicit correction)
  async updateContext(userId, category, key, value) {
    return this.prisma.contextEntry.upsert({
      where: { userId_category_key: { userId, category, key } },
      create: { userId, category, key, value, confidence: 1.0 },
      update: { value, confidence: 1.0, updatedAt: new Date() },
    });
  }

  // Check if we should skip extraction due to rate limiting
  shouldSkipExtraction(userId) {
    const lastTime = this.lastExtractionTime.get(userId);
    if (lastTime && (Date.now() - lastTime) < this.EXTRACTION_COOLDOWN_MS) {
      return true;
    }
    return false;
  }

  // Apply context decay to old facts
  async applyContextDecay(userId) {
    const decayDate = new Date(Date.now() - this.DECAY_DAYS * 24 * 60 * 60 * 1000);
    
    const entries = await this.prisma.contextEntry.findMany({
      where: { 
        userId,
        updatedAt: { lt: decayDate },
        confidence: { gt: this.DECAY_THRESHOLD }
      }
    });
    
    for (const entry of entries) {
      const daysSinceUpdate = Math.floor((Date.now() - new Date(entry.updatedAt).getTime()) / (24 * 60 * 60 * 1000));
      const decayFactor = Math.max(this.DECAY_THRESHOLD, 1 - (daysSinceUpdate / (this.DECAY_DAYS * 2)));
      const newConfidence = Math.round(entry.confidence * decayFactor * 100) / 100;
      
      if (newConfidence < entry.confidence) {
        await this.prisma.contextEntry.update({
          where: { id: entry.id },
          data: { confidence: newConfidence }
        });
      }
    }
  }

  // Update lastUsedAt when context is used in a response
  async markContextUsed(userId, category, key) {
    const entry = await this.prisma.contextEntry.findUnique({
      where: { userId_category_key: { userId, category, key } }
    });
    if (entry) {
      await this.prisma.contextEntry.update({
        where: { id: entry.id },
        data: { updatedAt: new Date() } // Touch updatedAt to show it's recent
      });
    }
  }

  // Process a message and store any extracted context
  async learnFromMessage(userId, message) {
    // Rate limiting: skip if extracted recently
    if (this.shouldSkipExtraction(userId)) {
      return [];
    }
    
    const facts = this.extractContext(message);
    if (facts.length > 0) {
      // Update last extraction time
      this.lastExtractionTime.set(userId, Date.now());
      
      // Apply decay to old facts before storing new ones
      await this.applyContextDecay(userId);
      
      return this.storeContext(userId, facts);
    }
    return [];
  }

  // Get context summary for debugging/display
  async getContextSummary(userId) {
    // Apply decay before fetching
    await this.applyContextDecay(userId);
    
    const entries = await this.prisma.contextEntry.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    
    return {
      totalFacts: entries.length,
      byCategory: entries.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + 1;
        return acc;
      }, {}),
      latestUpdate: entries.length > 0 ? entries[0].updatedAt : null,
      entries: entries.slice(0, 20), // Latest 20 for display
    };
  }

  // Delete all context for a user (for privacy/fresh start)
  async clearAllContext(userId) {
    const result = await this.prisma.contextEntry.deleteMany({
      where: { userId }
    });
    
    // Clear rate limiting timestamp too
    this.lastExtractionTime.delete(userId);
    
    return { deleted: result.count };
  }
}

module.exports = { ContextMemory };