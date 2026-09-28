import { seedAtlas } from './seedAtlas.js';

seedAtlas()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
