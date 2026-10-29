export const savedKeys = {current: 'mabletonlink.saved.v2', favorites: 'mabletonlink.favorites.v1', plans: 'mabletonlink.plans.v1'};
export function savedItemKey(item) {return [item.kind, item.id, item.outcome || ''].join(':');}
export function normalizeSavedItems(items, isValid) {
  const seen = new Set();
  return (Array.isArray(items) ? items : []).filter(item => {
    if (!isValid(item)) return false;
    const key = savedItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).map(item => item.kind === 'service' ? {kind: 'service', id: item.id} : {kind: 'journey', id: item.id, outcome: item.outcome});
}
export function loadSavedItems(storage, isValid) {
  const parse = key => {try {return JSON.parse(storage.getItem(key));} catch {return null;}};
  const current = parse(savedKeys.current);
  if (Array.isArray(current)) return normalizeSavedItems(current, isValid);
  const favorites = parse(savedKeys.favorites), plans = parse(savedKeys.plans);
  return normalizeSavedItems([
    ...(Array.isArray(favorites) ? favorites.map(id => ({kind: 'service', id})) : []),
    ...(Array.isArray(plans) ? plans : []),
  ], isValid);
}
export function toggleSavedItem(items, item) {
  const key = savedItemKey(item);
  return items.some(value => savedItemKey(value) === key)
    ? items.filter(value => savedItemKey(value) !== key) : [item, ...items];
}
export function persistSavedItems(storage, items) {
  // One atomic write; legacy keys remain as a backup. An empty v2 list is authoritative.
  try {storage.setItem(savedKeys.current, JSON.stringify(items)); return true;} catch {return false;}
}
