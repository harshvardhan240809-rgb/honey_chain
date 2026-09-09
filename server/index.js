const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const { demoUsers, hives, sensors, alerts, batches, labVerifications, bottles, blockchain, aiAnalyses, hashPassword, generateNewSensorSample, now } = require('./data');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '5mb' }));

function requireRole(roles) {
  return (req, res, next) => {
    const role = (req.headers['x-user-role'] || req.headers['x-role'] || '').toLowerCase();
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden: role not allowed' });
    }
    next();
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Honey Chain API', timestamp: now() }));

app.post('/api/auth/register', (req, res) => {
  const { name, username, password, role = 'beekeeper' } = req.body || {};
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Name, username, and password are required' });
  }

  const userExists = demoUsers.find((entry) => entry.username.toLowerCase() === String(username).toLowerCase());
  if (userExists) return res.status(409).json({ error: 'User already exists' });

  const newUser = { id: `user-${Date.now()}`, name, username, passwordHash: hashPassword(password), role };
  demoUsers.push(newUser);
  return res.status(201).json({ user: { id: newUser.id, name, username, role }, session: { id: newUser.id, name, username, role, createdAt: now() } });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = demoUsers.find((entry) => entry.username.toLowerCase() === String(username || '').toLowerCase() && entry.passwordHash === hashPassword(password || ''));
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });
  return res.json({ user: { id: user.id, name: user.name, username: user.username, role: user.role }, session: { id: user.id, name: user.name, username: user.username, role: user.role, createdAt: now() } });
});

app.get('/api/hives', (_req, res) => {
  const enriched = hives.map((hive) => {
    const history = sensors[hive.id] || [];
    const latest = history[history.length - 1];
    return { ...hive, history, latest, health: normalizeHiveHealth(latest) };
  });
  res.json(enriched);
});

app.get('/api/hives/:id', (req, res) => {
  const hive = hives.find((entry) => entry.id === req.params.id);
  if (!hive) return res.status(404).json({ error: 'Hive not found' });
  const history = sensors[hive.id] || [];
  const latest = history[history.length - 1];
  const linkedBatches = batches.filter((batch) => batch.hiveId === hive.id);
  res.json({ ...hive, history, latest, linkedBatches, alerts: alerts.filter((entry) => entry.hiveId === hive.id), health: normalizeHiveHealth(latest) });
});

app.post('/api/hives', requireRole(['beekeeper', 'admin']), (req, res) => {
  const body = req.body || {};
  if (!body.id) return res.status(400).json({ error: 'Hive ID is required' });

  const newHive = {
    id: body.id,
    name: body.name || `Hive ${body.id}`,
    location: body.location || 'Unknown',
    beekeeper: body.beekeeper || 'Demo Beekeeper',
    type: body.type || 'Langstroth',
    installationDate: body.installationDate || new Date().toISOString().slice(0, 10),
    device: body.device || 'Mock IoT Sensor',
    status: 'healthy',
    health: 'Healthy',
  };

  hives.push(newHive);
  sensors[newHive.id] = [{ hiveId: newHive.id, temperature: 34.2, humidity: 66, weight: 42.1, battery: 92, timestamp: now() }];
  res.status(201).json({ message: 'Hive created', hive: newHive });
});

app.get('/api/iot/hives/:hiveId/latest', (req, res) => {
  const history = sensors[req.params.hiveId] || [];
  if (!history.length) return res.status(404).json({ error: 'No IoT data recorded' });
  res.json(history[history.length - 1]);
});

app.get('/api/iot/hives/:hiveId/history', (req, res) => {
  const history = sensors[req.params.hiveId] || [];
  res.json(history.slice(-30));
});

app.post('/api/iot/readings', (req, res) => {
  const { hiveId, temperature, humidity, weight } = req.body || {};
  if (!hiveId) return res.status(400).json({ error: 'hiveId is required' });

  const current = sensors[hiveId] || [];
  const reading = { hiveId, temperature: Number(temperature ?? 34.2), humidity: Number(humidity ?? 67), weight: Number(weight ?? 41.8), battery: 90, timestamp: now() };
  current.push(reading);
  sensors[hiveId] = current;
  res.status(201).json({ message: 'Reading ingested', reading });
});

app.get('/api/alerts', (_req, res) => res.json(alerts));

app.post('/api/ai/analyze-hive', (req, res) => {
  const { hiveId, image, recentTemperature, recentHumidity, recentWeight, historicalTrends } = req.body || {};
  if (!hiveId) return res.status(400).json({ error: 'hiveId is required' });

  const history = sensors[hiveId] || [];
  const latest = history[history.length - 1] || { temperature: recentTemperature || 34.2, humidity: recentHumidity || 67, weight: recentWeight || 41.8 };
  const riskLevel = latest.humidity > 72 ? 'MODERATE' : 'LOW';
  const condition = latest.humidity > 72 ? 'Possible Varroa-related stress' : 'Stable hive pattern';

  const response = {
    possibleCondition: condition,
    confidence: 0.87,
    riskLevel,
    visualIndicators: image ? ['Image reviewed for abnormal cluster density'] : [],
    iotIndicators: [`Recent temperature: ${latest.temperature.toFixed(1)}°C`, `Recent humidity: ${latest.humidity.toFixed(1)}%`, `Recent weight: ${latest.weight.toFixed(1)} kg`],
    trendIndicators: historicalTrends || ['Temperature remains mostly stable', 'Humidity trend indicates mild elevation'],
    explanation: 'AI-assisted assessment indicates a possible issue requiring a field inspection and continued monitoring. This is not a definitive diagnosis.',
    recommendedActions: ['Inspect hive ventilation and check frame coverage.', 'Increase monitoring frequency for the next 12 hours.', 'Consult an apiculture expert if symptoms persist.'],
    requiresExpertReview: riskLevel === 'MODERATE',
  };

  aiAnalyses.push({ hiveId, ...response });
  res.json(response);
});

app.get('/api/batches', (_req, res) => res.json(batches));

app.post('/api/batches', requireRole(['beekeeper', 'admin']), (req, res) => {
  const payload = req.body || {};
  const id = payload.id || `HC-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`;
  const newBatch = {
    id,
    hiveId: payload.hiveId || 'H-102',
    beekeeper: payload.beekeeper || 'Demo Beekeeper',
    harvestDate: payload.harvestDate || new Date().toISOString().slice(0, 10),
    harvestLocation: payload.harvestLocation || 'Indore, Madhya Pradesh',
    floralSource: payload.floralSource || 'Mustard',
    quantityKg: Number(payload.quantityKg || 30),
    notes: payload.notes || 'Batch created from monitored hive output.',
    originScore: 92,
    originSummary: 'Evidence is consistent with the claimed origin information.',
    labStatus: 'PENDING',
    blockchainStatus: 'PENDING',
    createdAt: now(),
  };

  batches.push(newBatch);
  blockchain[newBatch.id] = [{ eventType: 'BATCH_REGISTERED', txHash: `0x${crypto.randomBytes(8).toString('hex')}`, timestamp: now(), status: 'VERIFIED' }];
  res.status(201).json({ message: 'Batch created', batch: newBatch });
});

app.get('/api/lab/batches', requireRole(['lab', 'admin']), (_req, res) => res.json(batches));

app.post('/api/lab/verifications', requireRole(['lab', 'admin']), (req, res) => {
  const payload = req.body || {};
  const batch = batches.find((entry) => entry.id === payload.batchId);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });

  const verification = {
    id: `LAB-${Date.now()}`,
    batchId: payload.batchId,
    testType: payload.testType || 'Moisture & Purity',
    result: payload.result || 'PASSED',
    certificateNumber: payload.certificateNumber || `HC-LAB-${Date.now()}`,
    testingDate: payload.testingDate || new Date().toISOString().slice(0, 10),
    remarks: payload.remarks || 'Sample verified in demo mode.',
    certificateFile: payload.certificateFile || 'demo-certificate.pdf',
  };

  labVerifications.push(verification);
  batch.labStatus = verification.result;
  batch.blockchainStatus = 'VERIFIED';
  blockchain[batch.id] = [...(blockchain[batch.id] || []), { eventType: 'LAB_VERIFICATION', txHash: `0x${crypto.randomBytes(8).toString('hex')}`, timestamp: now(), status: 'VERIFIED' }];
  res.status(201).json({ message: 'Lab verification recorded', verification });
});

app.get(['/api/blockchain/:batchId', '/api/blockchain/:batchId/history'], (req, res) => res.json(blockchain[req.params.batchId] || []));

app.post('/api/qr/generate', (req, res) => {
  const { batchId } = req.body || {};
  const batch = batches.find((entry) => entry.id === batchId);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });

  const token = `${batch.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}-b${Date.now().toString().slice(-5)}`;
  const bottle = { id: `${batch.id}-B${String((bottles.filter((b) => b.batchId === batchId).length + 1)).padStart(3, '0')}`, batchId: batch.id, token, qrUrl: `/verify/${token}`, printedAt: now() };
  bottles.push(bottle);
  res.status(201).json({ bottle });
});

app.get('/api/verify/:token', (req, res) => {
  const token = req.params.token;
  const bottle = bottles.find((entry) => entry.token === token || entry.qrUrl.includes(token));
  const batchId = bottle?.batchId || (batches.some((entry) => entry.id === token) ? token : null);
  if (!batchId) return res.status(404).json({ verified: false, error: 'Bottle or batch not found' });

  const batch = batches.find((entry) => entry.id === batchId);
  const verification = labVerifications.find((entry) => entry.batchId === batchId) || null;
  const chain = blockchain[batchId] || [];
  res.json({ verified: true, bottle, batch, verification, chain, risk: assessRisk({ batch, verification, chain }) });
});

app.get('/api/madhu-shield/:batchId', (req, res) => {
  const batch = batches.find((entry) => entry.id === req.params.batchId);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  res.json(assessRisk({ batch }));
});

app.get('/api/marketplace/beekeepers', (_req, res) => {
  res.json([
    { name: 'Demo Beekeeper', location: 'Indore, Madhya Pradesh', verified: true, honeyTypes: ['Mustard', 'Sunflower'], trustScore: 92 },
    { name: 'Madhya Valley Apiary', location: 'Dhar, Madhya Pradesh', verified: true, honeyTypes: ['Wildflower', 'Litchi'], trustScore: 88 },
  ]);
});

function normalizeHiveHealth(latest) {
  if (!latest) return 'Unknown';
  if (latest.temperature > 36 || latest.humidity > 72) return 'Attention Required';
  return 'Healthy';
}

function assessRisk({ batch, verification, chain }) {
  let score = 8;
  const signals = [];
  if (batch && batch.labStatus === 'PASSED') score -= 4;
  if (verification) score -= 5; else signals.push('Missing laboratory verification checkpoint.');
  if (!batch || !batch.harvestLocation) { score += 15; signals.push('Critical batch metadata missing.'); }
  if (chain && chain.length > 1) score -= 3;

  const normalizedScore = Math.max(0, Math.min(score, 100));
  if (score >= 60) {
    return { level: 'HIGH RISK', score: normalizedScore, signals: signals.length ? signals : ['No major inconsistencies detected.'], summary: 'High risk findings were observed in the traceability chain.' };
  }
  if (score >= 30) {
    return { level: 'ATTENTION REQUIRED', score: normalizedScore, signals: signals.length ? signals : ['Minor inconsistencies are under review.'], summary: 'Additional checks are recommended before consumer trust is fully confirmed.' };
  }
  return { level: 'LOW RISK', score: normalizedScore, signals: ['No major inconsistencies detected.'], summary: 'The batch appears consistent with the verified traceability workflow.' };
}

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

setInterval(() => { hives.forEach((hive) => generateNewSensorSample(hive.id)); }, 12000);

app.listen(port, () => console.log(`Honey Chain API listening on ${port}`));
