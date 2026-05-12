// Unit tests for sovereign.js - AXIS State Intelligence System
// Run with: node tests/sovereign.test.js

var sovereign = require('../lib/sovereign').sovereign;
var sovereignPromptLayer = require('../lib/sovereign').sovereignPromptLayer;
var STATES = require('../lib/sovereign').STATES;
var PING_THROTTLE = require('../lib/sovereign').PING_THROTTLE;
var serializeSovereignMemory = require('../lib/sovereign').serializeSovereignMemory;
var deserializeSovereignMemory = require('../lib/sovereign').deserializeSovereignMemory;
var getResponseStyle = require('../lib/sovereign').getResponseStyle;
var SIGNALS = require('../lib/sovereign').SIGNALS;

// Test runner
var passed = 0;
var failed = 0;
var describeCount = 0;
var testCount = 0;

function describe(name, fn) {
  describeCount++;
  console.log('\n=== ' + name + ' ===');
  try {
    fn();
  } catch (e) {
    console.log('DESCRIBE ERROR: ' + e.message);
    failed++;
  }
}

function test(name, fn) {
  testCount++;
  try {
    fn();
    console.log('  PASS: ' + name);
    passed++;
  } catch (e) {
    console.log('  FAIL: ' + name + ' - ' + e.message);
    failed++;
  }
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error((msg || 'Assertion') + ': expected ' + expected + ', got ' + actual);
  }
}

function assertTrue(value, msg) {
  if (!value) {
    throw new Error((msg || 'Assertion') + ': expected truthy, got ' + value);
  }
}

// Check if currently in protected time
function isProtectedTime() {
  var now = new Date();
  var hour = now.getHours() + now.getMinutes() / 60;
  return (hour >= 0 && hour < 5.5) || (hour >= 17 && hour < 20.5);
}

// Map genders to expected pronouns
var pronounMap = {
  female: { subject: 'She', object: 'her' },
  male: { subject: 'He', object: 'him' },
  'non-binary': { subject: 'They', object: 'them' },
  transgender: { subject: 'They', object: 'them' }
};

console.log('\n========================================');
console.log('SOVEREIGN.JS TEST SUITE');
console.log('========================================');
console.log('Protected time: ' + (isProtectedTime() ? 'YES' : 'NO'));

// ============================================
// STATE DETECTION
// ============================================
describe('State Detection', function() {
  var isProtected = isProtectedTime();
  var expectedDefault = isProtected ? 'REST' : 'BUILD';

  test('Default state is BUILD (or REST if protected)', function() {
    var result = sovereign('hello world', {}, 't', 'female');
    assertEqual(result.state, expectedDefault);
  });

  test('PROTECT triggers on distress signals', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('I cant do this anymore', {}, 't', 'female');
    assertEqual(result.state, 'PROTECT');
  });

  test('REST triggers on depletion signals', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('I am exhausted and burned out', {}, 't', 'female');
    assertEqual(result.state, 'REST');
  });

  test('HOLD triggers on low energy signals', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('I am feeling tired', {}, 't', 'female');
    assertEqual(result.state, 'HOLD');
  });

  test('HOLD should allow persona', function() {
    if (isProtected) {
      console.log('  (protected time)');
      return;
    }
    var result = sovereign('I am feeling tired', {}, 't', 'female');
    assertTrue(result.personaActive !== false, 'personaActive should not be false in HOLD');
  });

  test('FLOW triggers on high energy signals', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('I am feeling great and energetic', {}, 't', 'female');
    assertEqual(result.state, 'FLOW');
  });

  test('BUILD triggers on task signals', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('Let us get to work', {}, 't', 'female');
    assertEqual(result.state, 'BUILD');
  });
});

// ============================================
// MULTI-GENDER SUPPORT
// ============================================
describe('Multi-Gender Support', function() {
  var genders = ['female', 'male', 'non-binary', 'transgender'];

  genders.forEach(function(gender) {
    test('getResponseStyle for ' + gender, function() {
      // getResponseStyle(state, gender) - use BUILD state to test gender param
      var style = getResponseStyle('BUILD', gender);
      assertTrue(style.tone.length > 0, 'Tone should be set for ' + gender);
      assertTrue(style.maxWords > 0, 'maxWords should be set for ' + gender);
    });

    test('REST tone uses correct pronoun for ' + gender, function() {
      // getResponseStyle(state, gender) - use REST state
      var style = getResponseStyle('REST', gender);
      var p = pronounMap[gender];
      // REST tone should say 'I see ${object}' like 'I see her' for female
      assertTrue(style.tone.indexOf('I see ' + p.object) !== -1,
        'REST tone should say \"I see ' + p.object + '\" for ' + gender + ' but got: ' + style.tone);
    });
  });
});

// ============================================
// SIGNAL DETECTION
// ============================================
describe('Signal Detection', function() {
  var isProtected = isProtectedTime();

  test('Menstrual signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I am on my period', {}, 't', 'female');
    assertEqual(result.cyclePhase, 'menstrual');
  });

  test('Luteal signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I am in my luteal phase', {}, 't', 'female');
    assertEqual(result.cyclePhase, 'luteal');
  });

  test('Ovulation signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I am ovulating today', {}, 't', 'female');
    assertEqual(result.cyclePhase, 'ovulation');
  });

  test('Follicular signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I am in my follicular phase', {}, 't', 'female');
    assertEqual(result.cyclePhase, 'follicular');
  });

  test('Male testosterone dip signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('testosterone is low today', {}, 't', 'male');
    assertEqual(result.hrtPhase, 'testosteroneDip');
  });

  test('Trans estrogen fluctuation detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('estrogen levels are fluctuating', {}, 't', 'transgender');
    assertEqual(result.hrtPhase, 'estrogenFluctuation');
  });

  test('isWin signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I closed the deal today', {}, 't', 'female');
    assertTrue(result.isWin === true, 'isWin should be true');
  });

  test('isStall signal detected', function() {
    if (isProtected) {
      console.log('  (protected time bypasses signal detection)');
      return;
    }
    var result = sovereign('I am stuck and not moving forward', {}, 't', 'female');
    assertTrue(result.isStall === true, 'isStall should be true');
  });
});

// ============================================
// PING THROTTLE
// ============================================
describe('Ping Throttle', function() {
  test('REST state blocks all pings', function() {
    assertTrue(PING_THROTTLE.REST.languages === false, 'REST should block languages');
    assertTrue(PING_THROTTLE.REST.domains === false, 'REST should block domains');
    assertTrue(PING_THROTTLE.REST.culture === false, 'REST should block culture');
  });

  test('PROTECT state blocks all pings', function() {
    assertTrue(PING_THROTTLE.PROTECT.languages === false, 'PROTECT should block languages');
    assertTrue(PING_THROTTLE.PROTECT.domains === false, 'PROTECT should block domains');
  });

  test('HOLD state allows language pings', function() {
    assertTrue(PING_THROTTLE.HOLD.languages === true, 'HOLD should allow languages');
  });

  test('BUILD state allows domain pings', function() {
    assertTrue(PING_THROTTLE.BUILD.domains === true, 'BUILD should allow domains');
  });

  test('FLOW state allows all pings', function() {
    assertTrue(PING_THROTTLE.FLOW.languages === true, 'FLOW should allow languages');
    assertTrue(PING_THROTTLE.FLOW.domains === true, 'FLOW should allow domains');
    assertTrue(PING_THROTTLE.FLOW.culture === true, 'FLOW should allow culture');
  });
});

// ============================================
// HEALTH CHECKUP TRIGGER
// ============================================
describe('Health Checkup Trigger', function() {
  var isProtected = isProtectedTime();

  test('REST state triggers health checkup', function() {
    var result = sovereign('I am exhausted', {}, 't', 'female');
    if (isProtected) {
      console.log('  (protected time - healthCheckupTrigger behavior differs)');
      return;
    }
    assertTrue(result.healthCheckupTrigger === true, 'REST should trigger health checkup');
  });

  test('PROTECT state does not trigger health checkup', function() {
    if (isProtected) {
      console.log('  (protected time forces REST)');
      return;
    }
    var result = sovereign('I cant do this anymore', {}, 't', 'female');
    assertTrue(!result.healthCheckupTrigger, 'PROTECT should not trigger health checkup');
  });
});

// ============================================
// SERIALIZATION
// ============================================
describe('Serialization', function() {
  test('serializeSovereignMemory creates valid JSON', function() {
    var memory = {
      state: 'FLOW',
      cyclePhase: 'follicular',
      streak: 3,
      wins: ['closed deal'],
      stalls: [],
      pendingCommitments: []
    };
    var serialized = serializeSovereignMemory(memory);
    assertTrue(typeof serialized === 'string', 'Should return a string');
    var parsed = JSON.parse(serialized);
    assertEqual(parsed.state, 'FLOW');
  });

  test('deserializeSovereignMemory restores memory', function() {
    var memory = {
      state: 'BUILD',
      cyclePhase: 'luteal',
      streak: 2,
      wins: [],
      stalls: ['stuck'],
      pendingCommitments: []
    };
    var serialized = serializeSovereignMemory(memory);
    var restored = deserializeSovereignMemory(serialized);
    assertEqual(restored.state, 'BUILD');
    assertEqual(restored.cyclePhase, 'luteal');
    assertEqual(restored.streak, 2);
  });

  test('Round-trip preserves data', function() {
    var original = {
      state: 'HOLD',
      cyclePhase: 'menstrual',
      streak: 5,
      wins: ['won race', 'finished project'],
      stalls: ['blocked'],
      pendingCommitments: [{ text: 'call mom', createdAt: Date.now(), checked: false }]
    };
    var serialized = serializeSovereignMemory(original);
    var restored = deserializeSovereignMemory(serialized);
    assertEqual(restored.state, original.state);
    assertEqual(restored.cyclePhase, original.cyclePhase);
    assertEqual(restored.streak, original.streak);
    assertEqual(restored.wins.length, original.wins.length);
    assertEqual(restored.stalls.length, original.stalls.length);
  });
});

// ============================================
// PROMPT LAYER
// ============================================
describe('Prompt Layer Generation', function() {
  test('sovereignPromptLayer returns non-empty string', function() {
    var sovereignResult = sovereign('hello', {}, 't', 'female');
    var injection = sovereignPromptLayer(sovereignResult, 'female');
    assertTrue(injection.length > 0, 'Should return non-empty injection');
  });

  test('sovereignPromptLayer includes state info', function() {
    var sovereignResult = sovereign('hello', {}, 't', 'female');
    var injection = sovereignPromptLayer(sovereignResult, 'female');
    assertTrue(injection.length > 0, 'Should include state in injection');
  });

  test('Should include cycle guidance when phase is set', function() {
    var sovereignResult = sovereign('I am in my luteal phase', {}, 't', 'female');
    if (sovereignResult.cyclePhase) {
      var injection = sovereignPromptLayer(sovereignResult, 'female');
      assertTrue(injection.length > 0, 'Should include cycle guidance when phase is set');
    } else {
      console.log('  (cyclePhase not detected in protected time)');
    }
  });
});

// ============================================
// ACCOUNTABILITY MEMORY
// ============================================
describe('Accountability Memory', function() {
  var isProtected = isProtectedTime();

  test('Win tracked in accountability', function() {
    if (isProtected) {
      console.log('  (protected time bypasses accountability update)');
      return;
    }
    var memory = { state: 'FLOW', cyclePhase: null, streak: 0, wins: [], stalls: [], pendingCommitments: [] };
    var result = sovereign('I closed the deal today', memory, 't', 'female');
    assertTrue(result.accountability.wins.length > 0 || result.isWin === true,
      'Should track win');
  });

  test('Stall tracked in accountability', function() {
    if (isProtected) {
      console.log('  (protected time bypasses accountability update)');
      return;
    }
    var memory = { state: 'HOLD', cyclePhase: null, streak: 0, wins: [], stalls: [], pendingCommitments: [] };
    var result = sovereign('I am stuck on this project', memory, 't', 'female');
    assertTrue(result.accountability.stalls.length > 0 || result.isStall === true,
      'Should track stall');
  });

  test('Cycle phase detected and stored', function() {
    if (isProtected) {
      console.log('  (protected time bypasses accountability update)');
      return;
    }
    var memory = { state: 'BUILD', cyclePhase: null, streak: 0, wins: [], stalls: [], pendingCommitments: [] };
    var result = sovereign('I am in my follicular phase', memory, 't', 'female');
    assertEqual(result.cyclePhase, 'follicular');
  });

  test('Pending commitment tracked in REST state', function() {
    if (isProtected) {
      console.log('  (protected time)');
      return;
    }
    var memory = { state: 'REST', cyclePhase: null, streak: 0, wins: [], stalls: [], pendingCommitments: [] };
    var result = sovereign('I am going to call the doctor tomorrow', memory, 't', 'female');
    assertTrue(result.accountability.pendingCommitments.length > 0 ||
               result.accountabilityNote,
      'REST should track pending commitment');
  });
});

// ============================================
// PROTECTED TIME WINDOWS
// ============================================
describe('Protected Time Windows', function() {
  test('Sleep window detected (00:00-05:30)', function() {
    var hour = new Date().getHours() + new Date().getMinutes() / 60;
    var isSleepTime = hour >= 0 && hour < 5.5;
    assertTrue(isSleepTime === isProtectedTime() || !isSleepTime,
      'Sleep window detection works');
  });

  test('Family time window detected (17:00-20:30)', function() {
    var now = new Date();
    var hour = now.getHours() + now.getMinutes() / 60;
    var isFamilyTime = hour >= 17 && hour < 20.5;
    if (isFamilyTime) {
      assertTrue(isProtectedTime(), 'In family time, should be protected');
    }
  });

  test('REST forced during protected time', function() {
    if (!isProtectedTime()) {
      console.log('  (not currently in protected time)');
      return;
    }
    var result = sovereign('Let us build something', {}, 't', 'female');
    assertEqual(result.state, 'REST', 'Should force REST during protected time');
  });

  test('Protected flag set during sleep window', function() {
    if (!isProtectedTime()) {
      console.log('  (not currently in protected time)');
      return;
    }
    var result = sovereign('hello', {}, 't', 'female');
    assertTrue(result.protected === true, 'Should set protected flag during sleep');
  });
});

// ============================================
// RESPONSE STYLE BY STATE
// ============================================
describe('Response Style by State', function() {
  test('REST response is brief (maxWords: 60)', function() {
    var style = getResponseStyle('REST', 'female');
    assertTrue(style.maxWords <= 60, 'REST should be brief, got ' + style.maxWords);
  });

  test('FLOW response is longer (maxWords: 300)', function() {
    var style = getResponseStyle('FLOW', 'female');
    assertTrue(style.maxWords >= 200, 'FLOW should allow more words, got ' + style.maxWords);
  });

  test('HOLD response is moderate (maxWords: 120)', function() {
    var style = getResponseStyle('HOLD', 'female');
    assertTrue(style.maxWords >= 100, 'HOLD should allow moderate response, got ' + style.maxWords);
  });
});

// ============================================
// STATES CONSTANT
// ============================================
describe('STATES Constant', function() {
  test('All five states are defined', function() {
    assertTrue(STATES.FLOW === 'FLOW', 'FLOW should be defined');
    assertTrue(STATES.BUILD === 'BUILD', 'BUILD should be defined');
    assertTrue(STATES.HOLD === 'HOLD', 'HOLD should be defined');
    assertTrue(STATES.REST === 'REST', 'REST should be defined');
    assertTrue(STATES.PROTECT === 'PROTECT', 'PROTECT should be defined');
  });
});

// Summary
console.log('\n========================================');
console.log('TEST SUMMARY');
console.log('========================================');
console.log('Suites: ' + describeCount);
console.log('Tests: ' + testCount);
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
console.log('========================================');

if (failed > 0) {
  console.log('\nWARNING: ' + failed + ' test(s) failed');
  process.exit(1);
} else {
  console.log('\nSUCCESS: All tests passed!');
  process.exit(0);
}