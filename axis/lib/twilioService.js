const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = null;
    this.fromNumber = null;
  }

  initialize() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    }
  }

  formatPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.startsWith('1') && digits.length === 11 ? `+${digits}` : digits.length >= 10 ? `+1${digits}` : null;
  }

  isValidPhoneNumber(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  async sendSMS(to, message) {
    if (!this.client) return { success: false, error: 'Twilio not configured' };
    const formatted = this.formatPhoneNumber(to);
    if (!formatted) return { success: false, error: 'Invalid phone number' };
    try {
      const result = await this.client.messages.create({ body: message, from: this.fromNumber, to: formatted });
      return { success: true, sid: result.sid };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async handleIncomingSMS(from, message, userId) {
    return { from, message, userId, timestamp: new Date().toISOString() };
  }
}

module.exports = { TwilioService };
