const crypto = require('crypto');

const now = () => new Date().toISOString();
const seedDate = (offsetDays) => new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000).toISOString();

const demoUsers = [
  { id: 'user-1', name: 'Demo Beekeeper', username: 'beekeeper@example.com', passwordHash: hashPassword('demo123'), role: 'beekeeper' },
  { id: 'user-2', name: 'Demo Lab', username: 'lab@example.com', passwordHash: hashPassword('demo123'), role: 'lab' },
  { id: 'user-3', name: 'Platform Admin', username: 'admin@example.com', passwordHash: hashPassword('demo123'), role: 'admin' },
];

const hives = [
  {
    id: 'H-102',
    name: 'Hive H-102',
    location: 'Indore, Madhya Pradesh',
    beekeeper: 'Demo Beekeeper',
    type: 'Langstroth',
    installationDate: '2025-11-12',
    device: 'GoBuzzr Pro',
    status: 'healthy',
    health: 'Healthy',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'H-118',
    name: 'Hive H-118',
    location: 'Dhar, Madhya Pradesh',
    beekeeper: 'Demo Beekeeper',
    type: 'Top Bar',
    installationDate: '2025-12-04',
    device: 'GoBuzzr Pro',
    status: 'attention',
    health: 'Attention Required',
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'H-137',
    name: 'Hive H-137',
    location: 'Khargone, Madhya Pradesh',
    beekeeper: 'Demo Beekeeper',
    type: 'Langstroth',
    installationDate: '2026-01-20',
    device: 'GoBuzzr Pro',
    status: 'healthy',
    health: 'Healthy',
    imageUrl: 'https://images.unsplash.com/photo-1526304640582-3f0dd86a7d7d?auto=format&fit=crop&w=900&q=80',
  },
];

const sensors = {};

function generateInitialSensorHistory(hiveId, seed) {
  const arr = [];
  const baseTemp = seed && seed.temperature ? seed.temperature : 34.2;
  const baseHum = seed && seed.humidity ? seed.humidity : 66;
  let baseWeight = seed && seed.weight ? seed.weight : 41.8;

  for (let i = 0; i < 28; i++) {
    const timestamp = new Date(Date.now() - (27 - i) * 60 * 60 * 1000).toISOString();
    const drift = Math.sin(i / 3.2) * 0.7;
    const humDrift = Math.cos(i / 2.1) * 2.6;
    const weightDrift = Math.sin(i / 5.4) * 0.6;
    const temp = +(baseTemp + drift + (hiveId === 'H-118' ? 1.9 : 0)).toFixed(2);
    const humidity = +(baseHum + humDrift).toFixed(2);
    baseWeight += weightDrift;

    arr.push({
      hiveId,
      timestamp,
      temperature: temp,
      humidity: Math.min(90, Math.max(40, humidity)),
      weight: +baseWeight.toFixed(2),
      battery: 92 - i * 0.6,
    });
  }

  return arr;
}

hives.forEach((hive) => {
  sensors[hive.id] = generateInitialSensorHistory(hive.id, { temperature: 34.2, humidity: 66, weight: 41.8 });
});

const alerts = [
  {
    id: 'AL-201',
    hiveId: 'H-118',
    issue: 'Humidity has remained above the configured threshold for an extended period.',
    severity: 'ATTENTION',
    suggestedAction: 'Inspect hive ventilation and monitor brood condition.',
    timestamp: seedDate(1),
  },
  {
    id: 'AL-202',
    hiveId: 'H-102',
    issue: 'Temperature trend is stable and within the expected beehive range.',
    severity: 'NORMAL',
    suggestedAction: 'Continue routine observation.',
    timestamp: seedDate(0),
  },
];

const batches = [
  {
    id: 'HC-2026-001',
    hiveId: 'H-102',
    beekeeper: 'Demo Beekeeper',
    harvestDate: '2026-09-03',
    harvestLocation: 'Indore, Madhya Pradesh',
    floralSource: 'Mustard',
    quantityKg: 42,
    notes: 'Fresh harvest after a stable hive condition review.',
    originScore: 92,
    originSummary: 'Registered location, claimed floral source and harvest period are consistent with the available reference information.',
    labStatus: 'PASSED',
    blockchainStatus: 'VERIFIED',
    createdAt: seedDate(2),
  },
  {
    id: 'HC-2026-002',
    hiveId: 'H-118',
    beekeeper: 'Demo Beekeeper',
    harvestDate: '2026-09-05',
    harvestLocation: 'Dhar, Madhya Pradesh',
    floralSource: 'Sunflower',
    quantityKg: 28,
    notes: 'Monitoring required before lab submission.',
    originScore: 74,
    originSummary: 'Evidence is broadly consistent but additional checks are recommended.',
    labStatus: 'PENDING',
    blockchainStatus: 'PENDING',
    createdAt: seedDate(1),
  },
];

const labVerifications = [
  {
    id: 'LAB-9001',
    batchId: 'HC-2026-001',
    testType: 'Moisture & Purity',
    result: 'PASSED',
    certificateNumber: 'HC-LAB-2026-118',
    testingDate: '2026-09-07',
    remarks: 'Moisture level and floral profile are consistent with the declared batch.',
    certificateFile: 'demo-certificate.pdf',
  },
];

const bottles = [
  {
    id: 'HC-2026-001-B001',
    batchId: 'HC-2026-001',
    token: 'hc-2026-001-b001-9f5c',
    qrUrl: '/verify/hc-2026-001-b001-9f5c',
    printedAt: now(),
  },
];

const scans = [
  {
    id: 'SCAN-001',
    bottleId: 'HC-2026-001-B001',
    token: 'hc-2026-001-b001-9f5c',
    location: 'Indore, Madhya Pradesh',
    timestamp: seedDate(0),
    device: 'Demo Android Scanner',
  },
];

const blockchain = {
  'HC-2026-001': [
    { eventType: 'BATCH_REGISTERED', txHash: '0x5d8a3b9f6d7a2c1e', timestamp: seedDate(3), status: 'VERIFIED' },
    { eventType: 'LAB_VERIFICATION', txHash: '0x9e1c3a44ac7b88df', timestamp: seedDate(2), status: 'VERIFIED' },
    { eventType: 'PACKAGING', txHash: '0x11d7d5ae7d61e0c2', timestamp: seedDate(1), status: 'VERIFIED' },
  ],
  'HC-2026-002': [
    { eventType: 'BATCH_REGISTERED', txHash: '0x3ed90d98112bac57', timestamp: seedDate(1), status: 'PENDING' },
  ],
};

const aiAnalyses = [
  {
    hiveId: 'H-118',
    possibleCondition: 'Possible Varroa-related stress',
    confidence: 0.87,
    riskLevel: 'MODERATE',
    visualIndicators: ['Unusual movement pattern around entrance', 'Reduced activity near brood region'],
    iotIndicators: ['Temperature trending above expected range', 'Humidity elevated across the last 6 hours'],
    trendIndicators: ['Weight plateau since previous reading cycle'],
    explanation: 'The current hive signals align with stress indicators and require a field check before harvest planning.',
    recommendedActions: ['Inspect brood frames and entrance for mite activity', 'Improve ventilation and monitor after 12 hours'],
    requiresExpertReview: true,
  },
];

function generateNewSensorSample(hiveId) {
  const existing = sensors[hiveId] || [];
  const current = existing[existing.length - 1] || { temperature: 34.2, humidity: 67, weight: 41.8, battery: 92 };
  const temperature = +(current.temperature + (Math.random() * 1.4 - 0.7)).toFixed(2);
  const humidity = Math.min(90, Math.max(45, +(current.humidity + (Math.random() * 5 - 2.5)).toFixed(2)));
  const weight = +(current.weight + (Math.random() * 1.6 - 0.8)).toFixed(2);
  const sample = { hiveId, temperature, humidity, weight, battery: Math.max(20, Math.round(current.battery - Math.random() * 1.2)), timestamp: now() };
  existing.push(sample);
  if (existing.length > 40) existing.shift();
  return sample;
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

module.exports = {
  demoUsers,
  hives,
  sensors,
  alerts,
  batches,
  labVerifications,
  bottles,
  scans,
  blockchain,
  aiAnalyses,
  hashPassword,
  generateNewSensorSample,
  now,
};
