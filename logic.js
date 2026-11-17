'use strict';
// Az alkalmazás logikája (DOM nélkül), a data.js-ben lévő DATA-ra épül.

const KEY = 'mitfozzek.v1';

const TIERS = {
  cheap:     { title: 'Olcsó',   dots: '●○○', hint: 'kb. 700 Ft/adag alatt',     color: '#16a34a' },
  medium:    { title: 'Közepes', dots: '●●○', hint: 'kb. 700–1 600 Ft/adag',      color: '#d97706' },
  expensive: { title: 'Drága',   dots: '●●●', hint: 'kb. 1 600 Ft/adag felett',   color: '#9333ea' }
};
const TIER_ORDER = ['cheap', 'medium', 'expensive'];

const CATEGORIES = [
  { id: 'veg',    title: 'Zöldségek',            emoji: '🥕' },
  { id: 'fruit',  title: 'Gyümölcsök',           emoji: '🍎' },
  { id: 'meat',   title: 'Hús és hal',           emoji: '🥩' },
  { id: 'dairy',  title: 'Tejtermék és tojás',   emoji: '🥚' },
  { id: 'grain',  title: 'Tészta, rizs, pékáru', emoji: '🍝' },
  { id: 'canned', title: 'Konzerv és tartós',    emoji: '🥫' },
  { id: 'spice',  title: 'Fűszerek és szószok',  emoji: '🌶️' }
];

// ---------- Segédek ----------

function norm(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const ING = DATA.ingredients.map(i => Object.assign({}, i, { keys: [i.name].concat(i.aka).map(norm) }));
const ING_BY_ID = {};
ING.forEach(i => { ING_BY_ID[i.id] = i; });
const RECIPES = DATA.recipes;
RECIPES.forEach(r => { r.core = r.ing.filter(x => !x.opt && !ING_BY_ID[x.id].staple); });
const RECIPE_BY_ID = {};
RECIPES.forEach(r => { RECIPE_BY_ID[r.id] = r; });

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------- Állapot ----------

function defaultState() {
  return { pantry: [], custom: [], favorites: [], shopping: [], household: 0 };
}

function loadState(storage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}

function saveState(storage, state) {
  try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privát mód: nem mentünk */ }
}

// ---------- Mennyiségek ----------

const AM = {
  parse(text) {
    let s = String(text).trim();
    let prefix = '';
    if (s.toLowerCase().startsWith('kb. ')) { prefix = s.slice(0, 4); s = s.slice(4); }
    let i = 0;
    while (i < s.length && '0123456789,./'.indexOf(s[i]) >= 0) i++;
    const num = s.slice(0, i);
    if (!num) return null;
    let value;
    if (num.indexOf('/') >= 0) {
      const p = num.split('/');
      if (p.length !== 2) return null;
      const a = parseFloat(p[0].replace(',', '.'));
      const b = parseFloat(p[1].replace(',', '.'));
      if (isNaN(a) || isNaN(b) || b === 0) return null;
      value = a / b;
    } else {
      value = parseFloat(num.replace(',', '.'));
      if (isNaN(value)) return null;
    }
    return { prefix, value, rest: s.slice(i).trim() };
  },

  fmt(v) {
    if (v <= 0) return '0';
    const whole = Math.round(v);
    if (Math.abs(v - whole) < 0.05) return String(whole);
    if (v < 10) {
      const q = Math.round(v * 4) / 4;
      if (Math.abs(v - q) < 0.06) {
        const w = Math.floor(q);
        const f = q - w;
        const fr = f === 0.25 ? '1/4' : f === 0.5 ? '1/2' : f === 0.75 ? '3/4' : '';
        if (!fr) return String(w);
        return w === 0 ? fr : w + ' ' + fr;
      }
      return v.toFixed(1).replace('.', ',');
    }
    if (v >= 50) return String(Math.round(v / 5) * 5);
    return String(whole);
  },

  /** kg és l esetén tizedes (1,2 kg), egyébként a konyhai törtek (1/2, 1 1/4). */
  fmtQty(value, rest) {
    const unit = (rest.match(/^\S+/) || [''])[0];
    if (unit === 'kg' || unit === 'l') return String(Math.round(value * 100) / 100).replace('.', ',');
    return AM.fmt(value);
  },

  normUnit(value, rest) {
    const m = rest.match(/^(\S+)(.*)$/);
    if (!m) return [value, rest];
    const unit = m[1], tail = m[2];
    if (unit === 'g' && value >= 1000) return [value / 1000, 'kg' + tail];
    if (unit === 'ml' && value >= 1000) return [value / 1000, 'l' + tail];
    if (unit === 'dl' && value >= 10) return [value / 10, 'l' + tail];
    return [value, rest];
  },

  scale(text, factor) {
    if (factor === 1) return text;
    const q = AM.parse(text);
    if (!q) return text;
    const nu = AM.normUnit(q.value * factor, q.rest);
    const v = AM.fmtQty(nu[0], nu[1]);
    return nu[1] ? q.prefix + v + ' ' + nu[1] : q.prefix + v;
  },

  add(a, b) {
    if (!a) return b;
    if (!b) return a;
    const qa = AM.parse(a), qb = AM.parse(b);
    if (qa && qb && qa.rest.toLowerCase() === qb.rest.toLowerCase()) {
      const nu = AM.normUnit(qa.value + qb.value, qa.rest);
      const v = AM.fmtQty(nu[0], nu[1]);
      return nu[1] ? qa.prefix + v + ' ' + nu[1] : qa.prefix + v;
    }
    return a + ' + ' + b;
  }
};

// ---------- Otthoni készlet ----------

function has(state, id) {
  const ing = ING_BY_ID[id];
  if (!ing) return false;
  if (ing.staple || state.pantry.indexOf(id) >= 0) return true;
  for (const item of state.custom) {
    const term = norm(item);
    if (term.length >= 3 && ing.keys.some(k => k.indexOf(term) >= 0)) return true;
  }
  return false;
}

function togglePantry(state, id) {
  const i = state.pantry.indexOf(id);
  if (i >= 0) state.pantry.splice(i, 1); else state.pantry.push(id);
}

function addPantry(state, id) {
  if (state.pantry.indexOf(id) < 0) state.pantry.push(id);
}

function pantryCount(state) {
  return state.pantry.length + state.custom.length;
}

function suggestions(query) {
  const q = norm(query);
  if (!q) return [];
  return ING.filter(i => !i.staple && i.keys.some(k => k.indexOf(q) >= 0));
}

function exactMatchExists(query) {
  const q = norm(query);
  return ING.some(i => i.keys.indexOf(q) >= 0);
}

/** A beírt szöveget lehetőleg listás alapanyaghoz köti, különben saját tételként menti. */
function addTyped(state, text) {
  const trimmed = String(text).trim();
  const q = norm(trimmed);
  if (!q) return;
  const exact = ING.find(i => i.keys.indexOf(q) >= 0);
  if (exact) { if (!exact.staple) addPantry(state, exact.id); return; }
  const partial = ING.filter(i => !i.staple && i.keys.some(k => k.indexOf(q) >= 0));
  if (partial.length === 1) { addPantry(state, partial[0].id); return; }
  if (!state.custom.some(c => norm(c) === q)) state.custom.push(trimmed);
}

// ---------- Párosítás ----------

function matches(state, tier) {
  const out = [];
  for (const recipe of RECIPES) {
    if (tier && recipe.tier !== tier) continue;
    const have = recipe.core.filter(x => has(state, x.id));
    const missing = recipe.core.filter(x => !has(state, x.id));
    if (have.length === 0) continue;
    out.push({ recipe, have, missing });
  }
  out.sort((a, b) =>
    (a.missing.length - b.missing.length) ||
    (b.have.length - a.have.length) ||
    a.recipe.name.localeCompare(b.recipe.name, 'hu'));
  return out;
}

function unlockSuggestions(state, tier, limit) {
  const buckets = {};
  for (const m of matches(state, tier)) {
    if (m.missing.length === 1) {
      const id = m.missing[0].id;
      (buckets[id] = buckets[id] || []).push(m.recipe.name);
    }
  }
  return Object.keys(buckets)
    .map(id => ({ ingredient: ING_BY_ID[id], names: buckets[id].sort((a, b) => a.localeCompare(b, 'hu')) }))
    .sort((a, b) => (b.names.length - a.names.length) || a.ingredient.name.localeCompare(b.ingredient.name, 'hu'))
    .slice(0, limit || 3);
}

function ideas(state, tier, search, favOnly) {
  const q = norm(search || '');
  return RECIPES.filter(r => {
    if (tier && r.tier !== tier) return false;
    if (favOnly && state.favorites.indexOf(r.id) < 0) return false;
    if (!q) return true;
    if (norm(r.name).indexOf(q) >= 0) return true;
    return r.ing.some(x => ING_BY_ID[x.id].keys.some(k => k.indexOf(q) >= 0));
  });
}

function randomRecipe(tier) {
  const pool = RECIPES.filter(r => !tier || r.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Bevásárlólista ----------

function addToShopping(state, item) {
  const key = norm(item.name);
  const existing = state.shopping.find(e => {
    if (e.checked) return false;
    if (item.ingredientID) return e.ingredientID === item.ingredientID;
    return !e.ingredientID && norm(e.name) === key;
  });
  if (existing) {
    // Ugyanazt a receptet nem adjuk hozzá kétszer.
    if (item.source && existing.sources.indexOf(item.source) >= 0) return;
    existing.amount = AM.add(existing.amount, item.amount || '');
    if (item.source) existing.sources.push(item.source);
  } else {
    state.shopping.push({
      id: newId(),
      ingredientID: item.ingredientID || null,
      name: item.name,
      amount: item.amount || '',
      checked: false,
      sources: item.source ? [item.source] : []
    });
  }
}

function missingRequired(state, recipe) {
  return recipe.ing.filter(x => !x.opt && !has(state, x.id));
}

function addMissing(state, recipe, servings) {
  const factor = servings / Math.max(recipe.servings, 1);
  for (const x of missingRequired(state, recipe)) {
    addToShopping(state, {
      name: ING_BY_ID[x.id].name,
      amount: AM.scale(x.amount, factor),
      ingredientID: x.id,
      source: recipe.name
    });
  }
}

function addManualShopping(state, text) {
  const trimmed = String(text).trim();
  const q = norm(trimmed);
  if (!q) return;
  const ing = ING.find(i => !i.staple && i.keys.indexOf(q) >= 0);
  if (ing) addToShopping(state, { name: ing.name, amount: '', ingredientID: ing.id });
  else addToShopping(state, { name: trimmed, amount: '' });
}

function moveCheckedToPantry(state) {
  for (const item of state.shopping) {
    if (!item.checked) continue;
    if (item.ingredientID) addPantry(state, item.ingredientID);
    else addTyped(state, item.name);
  }
  state.shopping = state.shopping.filter(i => !i.checked);
}

function shoppingText(items, title) {
  const lines = items.map(i => '• ' + i.name + (i.amount ? ': ' + i.amount : ''));
  return title + '\n' + lines.join('\n');
}

if (typeof module !== 'undefined') {
  module.exports = { norm, AM, has, matches, unlockSuggestions, ideas, addTyped, addMissing, addManualShopping,
    moveCheckedToPantry, addToShopping, missingRequired, suggestions, exactMatchExists, defaultState,
    ING, RECIPES, TIERS, pantryCount, togglePantry, shoppingText };
}
