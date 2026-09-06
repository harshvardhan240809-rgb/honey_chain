const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());

// Serve client build when available (single deploy link)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  // fallback for SPA
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const { hives, sensors, batches, blockchain, generateNewSensorSample } = require('./data');
require('dotenv').config();
const mongoose = require('mongoose');
let dbConnected = false;
let HiveModel, BatchModel, SensorSample;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
      dbConnected = true;
      console.log('Connected to MongoDB');
      // lazy require to avoid requiring when not connected
      HiveModel = require('./models/Hive');
      BatchModel = require('./models/Batch');
      SensorSample = require('./models/SensorSample');
    })
    .catch(err=> console.warn('MongoDB connection failed, continuing with mock data', err.message));
}

// simulate sensor updates every 8 seconds
setInterval(() => {
  hives.forEach(h => generateNewSensorSample(h.id));
}, 8000);

app.get('/api/hives', (req, res) => {
  if (dbConnected && HiveModel) {
    return HiveModel.find().lean().then(async docs => {
      const enriched = await Promise.all(docs.map(async h => {
        const history = await SensorSample.find({ hiveId: h.id }).sort({ ts: 1 }).limit(48).lean();
        const last = history[history.length - 1] || null;
        return { ...h, history, last, health: computeHealth(last) };
      }));
      res.json(enriched);
    }).catch(()=>res.json([]))
  }
  const enriched = hives.map(h => {
    const history = sensors[h.id] || [];
    const last = history[history.length - 1] || null;
    return { ...h, history, last, health: computeHealth(last) };
  });
  res.json(enriched);
});

app.get('/api/hives/:id', (req, res) => {
  const id = req.params.id;
  if (dbConnected && HiveModel) {
    return HiveModel.findOne({ id }).lean().then(async hive => {
      if (!hive) return res.status(404).json({ error: 'Not found' });
      const history = await SensorSample.find({ hiveId: id }).sort({ ts: 1 }).lean();
      const last = history[history.length - 1] || null;
      res.json({ ...hive, history, last, health: computeHealth(last) });
    }).catch(()=>res.status(500).json({ error: 'db error' }))
  }
  const hive = hives.find(h => h.id === id);
  if (!hive) return res.status(404).json({ error: 'Not found' });
  const history = sensors[id] || [];
  const last = history[history.length - 1] || null;
  res.json({ ...hive, history, last, health: computeHealth(last) });
});

app.post('/api/hives', (req, res) => {
  const body = req.body;
  if (!body.id) return res.status(400).json({ error: 'id required' });
  if (dbConnected && HiveModel) {
    const doc = new HiveModel({ id: body.id, location: body.location || 'Unknown', beekeeper: body.beekeeper || 'Unknown', battery: 100 });
    return doc.save().then(()=>res.status(201).json({ ok:true })).catch(e=>res.status(500).json({ error: e.message }));
  }
  hives.push({ id: body.id, location: body.location || 'Unknown', beekeeper: body.beekeeper || 'Unknown', battery: 100 });
  sensors[body.id] = [];
  res.status(201).json({ ok: true });
});

app.get('/api/batches', (req, res) => res.json(batches));
app.get('/api/batches/:id', (req, res) => {
  const id = req.params.id;
  if (dbConnected && BatchModel) return BatchModel.findOne({ id }).lean().then(b=> b ? res.json(b) : res.status(404).json({ error: 'Not found' }));
  const b = batches.find(x => x.id === id);
  if (!b) return res.status(404).json({ error: 'Not found' });
  res.json(b);
});
app.post('/api/batches', (req, res) => {
  const body = req.body;
  if (!body.id) return res.status(400).json({ error: 'id required' });
  if (dbConnected && BatchModel) {
    const doc = new BatchModel(body);
    return doc.save().then(()=>{
      // create blockchain simulation
      const crypto = require('crypto');
      let prevHash = '0x000';
      const stages = ['Harvest', 'Quality Testing', 'Processing', 'Packaging', 'Distribution'];
      blockchain[body.id] = stages.map(stage => {
        const txId = crypto.randomUUID();
        const hash = crypto.createHash('sha256').update(txId + prevHash + body.id).digest('hex');
        const rec = { stage, timestamp: new Date().toISOString(), txId, prevHash, hash, status: 'Pending' };
        prevHash = hash;
        return rec;
      });
      res.status(201).json({ ok: true })
    }).catch(e=>res.status(500).json({ error: e.message }));
  }
  batches.push(body);
  // generate simple chain
  const crypto = require('crypto');
  let prevHash = '0x000';
  const stages = ['Harvest', 'Quality Testing', 'Processing', 'Packaging', 'Distribution'];
  blockchain[body.id] = stages.map(stage => {
    const txId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update(txId + prevHash + body.id).digest('hex');
    const rec = { stage, timestamp: new Date().toISOString(), txId, prevHash, hash, status: 'Pending' };
    prevHash = hash;
    return rec;
  });
  res.status(201).json({ ok: true });
});

app.get('/api/sensors/:hiveId', (req, res) => {
  const id = req.params.hiveId;
  if (dbConnected && SensorSample) {
    return SensorSample.find({ hiveId: id }).sort({ ts: -1 }).limit(48).lean().then(d=>res.json(d)).catch(()=>res.status(404).json({error:'Not found'}))
  }
  const history = sensors[id];
  if (!history) return res.status(404).json({ error: 'Not found' });
  res.json(history.slice(-48));
});

app.get('/api/blockchain/:batchId', (req, res) => {
  const id = req.params.batchId;
  const chain = blockchain[id];
  if (!chain) return res.status(404).json({ error: 'Not found' });
  res.json(chain);
});

app.get('/api/verify/:batchId', (req, res) => {
  const id = req.params.batchId;
  const batch = batches.find(b => b.id === id);
  if (!batch) return res.status(404).json({ verified: false });
  const chain = blockchain[id] || [];
  res.json({ verified: true, batch, chain });
});

function computeHealth(last) {
  if (!last) return 'Unknown';
  if (last.temperature > 40 || last.battery < 10) return 'Critical';
  if (last.temperature > 37 || last.battery < 30) return 'Warning';
  return 'Healthy';
}

app.listen(port, () => console.log(`Honey Chain API listening on ${port}`));
