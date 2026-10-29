import test from 'node:test';
import assert from 'node:assert/strict';
import {loadSavedItems, savedKeys, savedItemKey, toggleSavedItem, persistSavedItems} from '../public/saved-items.mjs';
const service = {kind: 'service', id: 'water'};
const journey = {kind: 'journey', id: 'trash', outcome: 'unknown'};
const valid = item => Boolean(item && (item.kind === 'service' && item.id === 'water' || item.kind === 'journey' && item.id === 'trash' && ['unknown', 'missed'].includes(item.outcome)));
const storage = entries => {const data = new Map(Object.entries(entries)); return {getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value)};};
test('legacy favorites and service plans merge once while preserving distinct guided outcomes', () => {
  const store = storage({[savedKeys.favorites]: JSON.stringify(['water', 'missing']), [savedKeys.plans]: JSON.stringify([service, journey, journey, {...journey, outcome: 'missed'}, null])});
  assert.deepEqual(loadSavedItems(store, valid), [service, journey, {...journey, outcome: 'missed'}]);
  assert.equal(store.getItem(savedKeys.current), null, 'reading does not modify the previous saved data');
});
test('removing the last migrated favorite does not resurrect old data on reload', () => {
  const store = storage({[savedKeys.favorites]: '["water"]', [savedKeys.plans]: JSON.stringify([service])});
  const next = toggleSavedItem(loadSavedItems(store, valid), service);
  assert.equal(persistSavedItems(store, next), true);
  assert.deepEqual(loadSavedItems(store, valid), []);
  assert.equal(store.getItem(savedKeys.favorites), '["water"]', 'legacy backup remains intact');
});
test('saving and removing a guided favorite retains the other service and outcome', () => {
  const next = toggleSavedItem([service], journey);
  assert.deepEqual(next, [journey, service]);
  assert.equal(savedItemKey(next[0]), 'journey:trash:unknown');
  assert.deepEqual(toggleSavedItem(next, journey), [service]);
});
test('invalid or malformed storage recovers valid legacy items and strips unsupported fields', () => {
  const store = storage({[savedKeys.current]: '{broken', [savedKeys.favorites]: 'null', [savedKeys.plans]: JSON.stringify([{...journey, question: 'not retained'}, {kind: 'journey', id: 'trash', outcome: 'missing'}])});
  assert.deepEqual(loadSavedItems(store, valid), [journey]);
});
test('unavailable browser storage reports failure without changing the in-memory saved list', () => {
  const items = [service, journey];
  assert.equal(persistSavedItems({setItem() {throw new Error('quota');}}, items), false);
  assert.deepEqual(items, [service, journey]);
  assert.deepEqual(loadSavedItems({getItem() {throw new Error('blocked');}}, valid), []);
});
