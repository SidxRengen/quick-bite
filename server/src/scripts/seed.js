import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { MenuItem } from '../models/MenuItem.js';
import { menuSeed } from '../data/menu.js';
await connectDatabase(env.mongoUri);
const result = await MenuItem.bulkWrite(menuSeed.map((item) => ({
  updateOne: { filter: { name: item.name }, update: { $setOnInsert: item }, upsert: true },
})));
console.log(`Menu ready: ${result.upsertedCount} added, ${menuSeed.length - result.upsertedCount} already existed`);
await disconnectDatabase();
