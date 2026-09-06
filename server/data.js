// Mock data and simulated IoT updates
const crypto = require('crypto');

const now = () => new Date().toISOString();

const hives = [
  { id: 'HIVE-001', location: 'Field A — 12.9716,77.5946', beekeeper: 'Ammu', battery: 94 },
  { id: 'HIVE-002', location: 'Field B — 12.9720,77.5950', beekeeper: 'Rahul', battery: 82 },
  { id: 'HIVE-003', location: 'Field C — 12.9730,77.5960', beekeeper: 'Meera', battery: 68 },
  { id: 'HIVE-004', location: 'Field D — 12.9740,77.5970', beekeeper: 'Sanjay', battery: 56 }
];

// sensor history map
const sensors = {};

hives.forEach(h => {
  sensors[h.id] = generateInitialSensorHistory(h.id);
});

function randBetween(a, b) { return +(a + Math.random() * (b - a)).toFixed(2); }

function generateInitialSensorHistory(hiveId) {
  const arr = [];
  let baseTemp = randBetween(32, 36);
  let baseHum = randBetween(40, 60);
  let baseWeight = randBetween(20, 30);
  for (let i = 0; i < 24; i++) {
    baseTemp += randBetween(-0.5, 0.5);
    baseHum += randBetween(-1, 1);
    baseWeight += randBetween(-0.2, 0.5);
    arr.push({
      ts: new Date(Date.now() - (24 - i) * 60 * 60 * 1000).toISOString(),
      temperature: +baseTemp.toFixed(2),
      humidity: +baseHum.toFixed(2),
      weight: +baseWeight.toFixed(2),
      activity: Math.round(randBetween(20, 100)),
      battery: Math.round(randBetween(50, 100))
    });
  }
  return arr;
}

// batches
const batches = [
  {
    id: 'HC-2026-001', hiveId: 'HIVE-001', beekeeper: 'Ammu', harvestDate: '2026-06-12', quantityKg: 12,
    location: 'Field A', quality: 'Passed', processing: 'Completed', packaging: 'Sealed', createdAt: now()
  },
  {
    id: 'HC-2026-002', hiveId: 'HIVE-002', beekeeper: 'Rahul', harvestDate: '2026-07-02', quantityKg: 8,
    location: 'Field B', quality: 'Pending', processing: 'In Progress', packaging: 'Pending', createdAt: now()
  },
  {
    id: 'HC-2026-003', hiveId: 'HIVE-003', beekeeper: 'Meera', harvestDate: '2026-08-01', quantityKg: 15,
    location: 'Field C', quality: 'Passed', processing: 'Completed', packaging: 'Sealed', createdAt: now()
  }
];

// simulated blockchain records per batch
const blockchain = {};

batches.forEach(b => {
  blockchain[b.id] = generateChainForBatch(b);
});

function generateChainForBatch(batch) {
  const stages = ['Harvest', 'Quality Testing', 'Processing', 'Packaging', 'Distribution'];
  let prevHash = '0x0000000000000000';
  return stages.map((stage, i) => {
    const tx = { stage, timestamp: new Date(Date.now() - (stages.length - i) * 3600 * 1000).toISOString() };
    const txId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update(txId + prevHash + batch.id).digest('hex');
    const record = { timestamp: tx.timestamp, txId, prevHash, hash, status: 'Verified' };
    prevHash = hash;
    return record;
  });
}

module.exports = { hives, sensors, batches, blockchain, generateNewSensorSample: generateSample };

function generateSample(hiveId) {
  const last = sensors[hiveId][sensors[hiveId].length - 1];
  const temp = +(last.temperature + randBetween(-0.8, 0.8)).toFixed(2);
  const hum = +(last.humidity + randBetween(-2, 2)).toFixed(2);
  const weight = +(last.weight + randBetween(-0.5, 0.6)).toFixed(2);
  const activity = Math.max(0, Math.round(last.activity + randBetween(-10, 10)));
  const battery = Math.max(5, Math.round(last.battery - randBetween(0, 0.5)));
  const sample = { ts: new Date().toISOString(), temperature: temp, humidity: hum, weight, activity, battery };
  sensors[hiveId].push(sample);
  if (sensors[hiveId].length > 100) sensors[hiveId].shift();
  return sample;
}
