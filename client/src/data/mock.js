export const sampleAlerts = []

export const sampleStats = { totalHives: 4, healthyHives: 3, honeyKg: 35, activeBatches: 3, alerts: 1 }

export const sampleHives = [
  { id: 'HIVE-001', location: 'Field A', health: 'Healthy' },
  { id: 'HIVE-002', location: 'Field B', health: 'Warning' },
  { id: 'HIVE-003', location: 'Field C', health: 'Healthy' },
  { id: 'HIVE-004', location: 'Field D', health: 'Healthy' }
]

export const sampleBatches = [
  { id: 'HC-2026-001', hiveId: 'HIVE-001', beekeeper: 'Ammu', harvestDate: '2026-06-12', quantityKg: 12, quality: 'Passed', processing: 'Completed', packaging: 'Sealed' },
  { id: 'HC-2026-002', hiveId: 'HIVE-002', beekeeper: 'Rahul', harvestDate: '2026-07-02', quantityKg: 8, quality: 'Pending', processing: 'In Progress', packaging: 'Pending' },
  { id: 'HC-2026-003', hiveId: 'HIVE-003', beekeeper: 'Meera', harvestDate: '2026-08-01', quantityKg: 15, quality: 'Passed', processing: 'Completed', packaging: 'Sealed' }
]
