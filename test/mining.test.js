import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceMining, beginMining, cancelMining, miningDuration } from '../src/gameplay.js';

test('a quick click advances cracks without immediately breaking dirt', () => {
  const result = advanceMining(beginMining('0,0,0', 'dirt'), 0.1);

  assert.equal(result.complete, false);
  assert.ok(result.progress > 0);
  assert.ok(result.progress < 1);
});

test('held mining breaks dirt in less than one second', () => {
  const result = advanceMining(beginMining('0,0,0', 'dirt'), 0.85);

  assert.equal(result.complete, true);
  assert.equal(result.progress, 1);
});

test('releasing cancels progress so a new attempt starts from the beginning', () => {
  const halfMined = advanceMining(beginMining('0,0,0', 'dirt'), 0.4).session;
  assert.equal(cancelMining(halfMined), null);
  assert.equal(beginMining('0,0,0', 'dirt').elapsed, 0);
});

test('stone takes about two seconds and longer than dirt', () => {
  assert.ok(miningDuration('stone') >= 1.9 && miningDuration('stone') <= 2.1);
  assert.ok(miningDuration('stone') > miningDuration('dirt'));
});
