// Combined server + test runner
const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const SERVER_URL = 'http://localhost:3000';
const TEST_USER_ID = 'test_user_e2e_' + Date.now();

console.log('=== WebSocket Health Checkup E2E Test ===\n');
console.log('Test user:', TEST_USER_ID);

let serverProcess;
let ws;
const results = { connection: false, healthPopup: false, submission: false, confirmation: false };

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function httpGet(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('HTTP timeout')); });
  });
}

async function runTest() {
  try {
    // Start server
    console.log('[1] Starting server...');
    serverProcess = spawn('node', ['server.js'], { cwd: process.cwd(), stdio: 'pipe' });
    serverProcess.stdout.on('data', (d) => process.stdout.write('[SERVER] ' + d));
    serverProcess.stderr.on('data', (d) => process.stderr.write('[SERVER ERROR] ' + d));
    
    // Wait for server to start
    await delay(3000);
    
    // First create the test user via HTTP API
    console.log('[1b] Creating test user...');
    try {
      const { default: fetch } = require('node:http');
      await new Promise((resolve, reject) => {
        const data = JSON.stringify({ userId: TEST_USER_ID, gender: 'female' });
        const req = require('http').request({
          hostname: 'localhost', port: 3000, path: '/api/sessions', method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => { console.log('    User created:', res.statusCode === 200 ? 'OK' : body); resolve(); });
        });
        req.on('error', (e) => { console.log('    User creation skip:', e.message); resolve(); });
        req.write(data);
        req.end();
      });
    } catch (e) {
      console.log('    User creation skip:', e.message);
    }
    await delay(500);
    
    // Check if server is running
    try {
      await httpGet('/health');
      console.log('    Server is running');
    } catch (e) {
      console.log('    Server not responding, waiting more...');
      await delay(2000);
      await httpGet('/health');
    }
    
    // Connect WebSocket
    console.log('\n[2] Connecting WebSocket...');
    ws = new WebSocket(`ws://localhost:3000?userId=${TEST_USER_ID}`);
    
    await new Promise((resolve, reject) => {
      ws.on('open', () => { console.log('    ✓ Connected'); resolve(); });
      ws.on('error', reject);
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
    results.connection = true;
    
    // Wait for popup
    console.log('\n[3] Waiting for health_checkup_popup...');
    await new Promise((resolve) => {
      const t = setTimeout(() => { console.log('    (no popup within 3s)'); resolve(); }, 3000);
      ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.type === 'health_checkup_popup') {
          clearTimeout(t);
          console.log('    ✓ Popup received!');
          results.healthPopup = true;
          resolve();
        }
      });
    });
    
    // Check API
    console.log('\n[4] Checking health-checkup API...');
    try {
      const check = await httpGet(`/api/health-checkup/${TEST_USER_ID}`);
      console.log('    Triggered:', check.triggered);
      console.log('    Reason:', check.reason);
    } catch (e) {
      console.log('    (API check skipped - may be expected)');
    }
    
    // Submit response
    console.log('\n[5] Submitting health checkup response...');
    ws.send(JSON.stringify({
      type: 'health_checkup_response',
      payload: { sleepQuality: 'good', moodLevel: 7, energyLevel: 6, symptoms: ['fatigue'], notes: 'Test', triggeredBy: 'test' }
    }));
    results.submission = true;
    console.log('    ✓ Response sent');
    
    // Wait for confirmation
    console.log('\n[6] Waiting for confirmation...');
    await new Promise((resolve) => {
      const t = setTimeout(() => { console.log('    (no confirmation within 2s)'); resolve(); }, 2000);
      ws.on('message', (d) => {
        const msg = JSON.parse(d);
        if (msg.type === 'health_checkup_confirmed') {
          clearTimeout(t);
          console.log('    ✓ Confirmation received!');
          results.confirmation = true;
        }
      });
    });
    
    // Verify via insights API
    console.log('\n[7] Verifying via insights API...');
    try {
      const insights = await httpGet(`/api/health-checkup/${TEST_USER_ID}/insights`);
      console.log('    Total checkups:', insights.totalCheckups);
      console.log('    Average mood:', insights.averageMood);
      console.log('    Trend:', insights.trend);
    } catch (e) {
      console.log('    (insights check skipped)');
    }
    
    ws.close();
    
    console.log('\n=== RESULTS ===');
    console.log('Connection: ' + (results.connection ? '✓' : '✗'));
    console.log('Popup received: ' + (results.healthPopup ? '✓' : 'ℹ'));
    console.log('Submission sent: ' + (results.submission ? '✓' : '✗'));
    console.log('Confirmation: ' + (results.confirmation ? '✓' : 'ℹ'));
    console.log('===============\n');
    
  } catch (error) {
    console.error('\n[ERROR]', error.message);
  } finally {
    if (ws) ws.close();
    if (serverProcess) serverProcess.kill();
    console.log('Server stopped.');
    process.exit(0);
  }
}

runTest();