class MultilingualRouter {
  constructor() {
    this.languages = {
      en: { code: 'en', name: 'English', nameNative: 'English' },
      ru: { code: 'ru', name: 'Russian', nameNative: 'Русский' },
      de: { code: 'de', name: 'German', nameNative: 'Deutsch' },
      es: { code: 'es', name: 'Spanish', nameNative: 'Español' },
      zh: { code: 'zh', name: 'Chinese', nameNative: '中文' },
      fi: { code: 'fi', name: 'Finnish', nameNative: 'Suomi' },
      fr: { code: 'fr', name: 'French', nameNative: 'Français' },
      ja: { code: 'ja', name: 'Japanese', nameNative: '日本語' },
      ko: { code: 'ko', name: 'Korean', nameNative: '한국어' },
      pt: { code: 'pt', name: 'Portuguese', nameNative: 'Português' }
    };
    this.patterns = {
      ru: /[а-яА-ЯёЁ]/,
      de: /[äöüßÄÖÜ]/,
      es: /[áéíóúñü¿¡]/,
      zh: /[\u4e00-\u9fff]/,
      fi: /[åäöÅÄÖ]/,
      fr: /[àâçéèêëîïôûùüÿœ]/i,
      ja: /[\u3040-\u309f\u30a0-\u30ff]/,
      ko: /[\uac00-\ud7af\u1100-\u11ff]/,
      pt: /[ãõç]/i
    };
  }

  detectLanguage(text) {
    for (const [lang, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(text)) return lang;
    }
    return 'en';
  }

  async route(userId, message, personas) {
    const lang = this.detectLanguage(message);
    const persona = personas?.find(p => p.name === 'NOVA') || { name: 'NOVA', systemPrompt: '' };
    return {
      language: this.languages[lang],
      routedPersona: persona,
      requiresTranslation: lang !== 'en',
      detectedLanguage: lang
    };
  }

  getSupportedLanguages() { return Object.values(this.languages); }
}

module.exports = { MultilingualRouter };
