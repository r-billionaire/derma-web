// Run: node src/lib/imagekit.test.mts
import assert from 'node:assert/strict';
import { getOptimizedImage } from './imagekit.ts';

const BASE = 'https://ik.imagekit.io/rbillionaire';

// The bug this file exists to catch: transforms must share one comma-separated
// `tr:` segment, not repeat the prefix (`tr:w-80tr:h-80` silently dropped h-80).
assert.equal(getOptimizedImage('logo.png', { width: 80, height: 80 }), `${BASE}/tr:w-80,h-80/logo.png`);

assert.equal(getOptimizedImage('logo.png'), `${BASE}/logo.png`);
assert.equal(getOptimizedImage('logo.png', { width: 80 }), `${BASE}/tr:w-80/logo.png`);
assert.equal(getOptimizedImage('logo.png', { quality: 80 }), `${BASE}/tr:q-80/logo.png`);
assert.equal(
  getOptimizedImage('logo.png', { width: 80, height: 80, quality: 50 }),
  `${BASE}/tr:w-80,h-80,q-50/logo.png`,
);

// No double slash when the caller writes a leading slash.
assert.equal(getOptimizedImage('/logo.png', { width: 80 }), `${BASE}/tr:w-80/logo.png`);

console.log('imagekit: all assertions passed');
