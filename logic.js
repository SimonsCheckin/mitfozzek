'use strict';

const KEY = 'mitfozzek.v7';

const TIERS = {
  cheap:     { title: { hu: 'Olcsó', en: 'Cheap' },   dots: '●○○', hint: { hu: 'kb. 700 Ft/adag alatt', en: 'under ~$2/portion' },     color: '#16a34a' },
  medium:    { title: { hu: 'Közepes', en: 'Medium' }, dots: '●●○', hint: { hu: 'kb. 700–1 600 Ft/adag', en: '~$2–$5/portion' },      color: '#d97706' },
  expensive: { title: { hu: 'Drága', en: 'Expensive' },   dots: '●●●', hint: { hu: 'kb. 1 600 Ft/adag felett', en: 'over ~$5/portion' },   color: '#9333ea' }
};
const TIER_ORDER = ['cheap', 'medium', 'expensive'];

const CATEGORIES = [
  { id: 'veg',    title: { hu: 'Zöldségek', en: 'Vegetables' },            emoji: '🥕' },
  { id: 'fruit',  title: { hu: 'Gyümölcsök', en: 'Fruits' },           emoji: '🍎' },
  { id: 'meat',   title: { hu: 'Hús és hal', en: 'Meat & Fish' },           emoji: '🥩' },
  { id: 'dairy',  title: { hu: 'Tejtermék és tojás', en: 'Dairy & Eggs' },   emoji: '🥚' },
  { id: 'grain',  title: { hu: 'Tészta, rizs, pékáru', en: 'Grains & Pasta' }, emoji: '🍝' },
  { id: 'canned', title: { hu: 'Konzerv és tartós', en: 'Canned & Pantry' },    emoji: '🥫' },
  { id: 'spice',  title: { hu: 'Fűszerek és szószok', en: 'Spices & Sauces' },  emoji: '🌶️' }
];

const I18N = {
  hu: {
    homeTitle: 'Mi van otthon?',
    resultsTitle: 'Mit főzzek?',
    ideasTitle: 'Napi Receptötletek',
    listTitle: 'Bevásárlólista',
    settingsTitle: 'Beállítások',
    searchHome: 'Írd be, mi van otthon (pl. tojás)',
    pantryHeader: '✅ Nálam van',
    clearBtn: 'Törlés',
    stapleNote: 'A só, bors, olaj, cukor és víz mindig megvan otthon, ezeket nem kell kiválasztanod.',
    ctaChoose: 'Válassz alapanyagokat',
    ctaCook: count => `Mit főzhetek ezekből? (${count})`,
    sortMissing: 'Legkevesebb hiányzó',
    sortTime: '⏱ Leggyorsabb elöl',
    aiGenBtn: '✨ Recept kitalálása az alapanyagokból',
    aiLoading: '🤖 Recept ötletelés...',
    readyRecipes: '✅ Főzhető receptek',
    almostRecipes: '🛒 Majdnem kész: 1–2 dolog hiányzik',
    smartShop: '💡 Okos bevásárlás',
    moreIdeas: count => `Több ötlet mutatása (${count})`,
    noPantry: 'Még nem adtál meg alapanyagot',
    noPantryDesc: 'Add meg, mi van otthon, és összerakok belőle egy ételt.',
    favs: 'Kedvencek',
    random: '🎲 Meglepj!',
    abcSort: 'ABC sorrend',
    timeSort: '⏱ Idő szerint',
    searchIdeas: 'Napi receptek keresése',
    ingredients: 'Hozzávalók',
    steps: 'Elkészítés',
    servings: 'adag',
    missingToShop: '🛒 Hiányzók a bevásárlólistára',
    shareMissing: '⇪ Hiányzók megosztása',
    allHave: '✅ Minden hozzávaló megvan otthon!',
    langLabel: 'Alkalmazás nyelve / App Language',
    apiKeyLabel: 'Gemini API Kulcs',
    apiKeyHint: 'Add meg a Google AI Stúdióban generált kulcsodat. A böngésződ biztonságosan, helyben tárolja.',
    saveKeyBtn: 'Kulcs mentése',
    keySavedToast: 'API kulcs sikeresen elmentve!',
    shopHeader: 'Bevásárlólista',
    shopPlaceholder: 'Új tétel (pl. tej)',
    buyList: 'Megvenni',
    boughtList: 'Megvettem',
    moveToPantry: '🧊 Megvettek átrakása az otthoni készletbe',
    shareList: '⇪ Lista megosztása',
    clearChecked: 'Kipipáltak törlése',
    clearAll: 'Teljes lista törlése',
    emptyList: 'Üres a lista.',
    aiBadge: '✨ Ajánlat',
    aiGeneratedText: 'Mesterséges intelligencia által generált recept',
    missingText: 'Hiányzik:',
    optionalText: 'elhagyható / bónusz',
    backBtn: '‹ Vissza',
    dailyNotice: 'Friss napi receptmagazin (minden reggel automatikusan új ételek)'
  },
  en: {
    homeTitle: 'What is at home?',
    resultsTitle: 'What to cook?',
    ideasTitle: 'Daily Recipe Ideas',
    listTitle: 'Shopping List',
    settingsTitle: 'Settings',
    searchHome: 'Type what you have (e.g. eggs)',
    pantryHeader: '✅ I have',
    clearBtn: 'Clear',
    stapleNote: 'Salt, pepper, oil, sugar and water are always assumed to be available.',
    ctaChoose: 'Choose ingredients',
    ctaCook: count => `What can I cook? (${count})`,
    sortMissing: 'Fewest missing',
    sortTime: '⏱ Fastest first',
    aiGenBtn: '✨ Find recipe from ingredients',
    aiLoading: '🤖 Brainstorming recipe...',
    readyRecipes: '✅ Cookable recipes',
    almostRecipes: '🛒 Almost ready: 1–2 items missing',
    smartShop: '💡 Smart Shopping',
    moreIdeas: count => `Show more ideas (${count})`,
    noPantry: 'No ingredients added yet',
    noPantryDesc: 'Add what you have at home, and I will find a recipe for you.',
    favs: 'Favorites',
    random: '🎲 Surprise me!',
    abcSort: 'Alphabetical',
    timeSort: '⏱ By time',
    searchIdeas: 'Search daily recipes',
    ingredients: 'Ingredients',
    steps: 'Instructions',
    servings: 'servings',
    missingToShop: '🛒 Add missing to shopping list',
    shareMissing: '⇪ Share missing items',
    allHave: '✅ You have all ingredients at home!',
    langLabel: 'App Language / Alkalmazás nyelve',
    apiKeyLabel: 'Gemini API Key',
    apiKeyHint: 'Enter your Gemini API key. It is securely saved in your browser storage only.',
    saveKeyBtn: 'Save API Key',
    keySavedToast: 'API key successfully saved!',
    shopHeader: 'Shopping List',
    shopPlaceholder: 'New item (e.g. milk)',
    buyList: 'To Buy',
    boughtList: 'Bought',
    moveToPantry: '🧊 Move bought items to pantry',
    shareList: '⇪ Share list',
    clearChecked: 'Clear checked',
    clearAll: 'Clear entire list',
    emptyList: 'List is empty.',
    aiBadge: '✨ Featured',
    aiGeneratedText: 'Generated recipe by Artificial Intelligence',
    missingText: 'Missing:',
    optionalText: 'optional / bonus',
    backBtn: '‹ Back',
    dailyNotice: 'Fresh daily recipe magazine (updates with new dishes every morning)'
  }
};

function t(key, lang = 'hu', ...args) {
  const dict = I18N[lang] || I18N.hu;
  const val = dict[key] || I18N.hu[key] || key;
  return typeof val === 'function' ? val(...args) : val;
}

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

const DEFAULT_API_KEY = '';

function defaultState() {
  return { 
    pantry: [], 
    custom: [], 
    favorites: [], 
    shopping: [], 
    household: 0, 
    apiKey: DEFAULT_API_KEY, 
    aiRecipes: [],
    lastDailyDate: '',
    lang: 'hu'
  };
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
  try { storage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}

const AM = {
  parse(text) {
    let s = String(text).trim();
    let prefix = '';
    if (s.toLowerCase().startsWith('kb. ') || s.toLowerCase().startsWith('approx. ')) { prefix = s.slice(0, 4); s = s.slice(4); }
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

function matches(state, tier, sortBy = 'missing') {
  const out = [];
  const allRecipes = RECIPES;
  
  for (const recipe of allRecipes) {
    if (tier && recipe.tier !== tier) continue;
    
    const coreList = recipe.core || recipe.ing;
    const have = coreList.filter(x => x.id && ING_BY_ID[x.id] && has(state, x.id));
    const missing = coreList.filter(x => x.id && ING_BY_ID[x.id] && !has(state, x.id));
    
    if (have.length === 0) continue;
    out.push({ recipe, have, missing });
  }

  out.sort((a, b) => {
    if (sortBy === 'time') {
      return (a.recipe.minutes || 20) - (b.recipe.minutes || 20);
    }
    return (a.missing.length - b.missing.length) ||
           (b.have.length - a.have.length) ||
           a.recipe.name.localeCompare(b.recipe.name, 'hu');
  });
  return out;
}

function unlockSuggestions(state, tier, limit) {
  const buckets = {};
  for (const m of matches(state, tier)) {
    if (m.missing.length === 1) {
      const id = m.missing[0].id;
      if (id && ING_BY_ID[id]) {
        (buckets[id] = buckets[id] || []).push(m.recipe.name);
      }
    }
  }
  return Object.keys(buckets)
    .map(id => ({ ingredient: ING_BY_ID[id], names: buckets[id].sort((a, b) => a.localeCompare(b, 'hu')) }))
    .sort((a, b) => (b.names.length - a.names.length) || a.ingredient.name.localeCompare(b.ingredient.name, 'hu'))
    .slice(0, limit || 3);
}

function ideas(state, tier, search, favOnly, sortBy = 'name') {
  const q = norm(search || '');
  const allRecipes = state.aiRecipes || [];
  const list = allRecipes.filter(r => {
    if (tier && r.tier !== tier) return false;
    if (favOnly && state.favorites.indexOf(r.id) < 0) return false;
    if (!q) return true;
    if (norm(r.name).indexOf(q) >= 0) return true;
    return r.ing.some(x => norm(x.name || '').indexOf(q) >= 0);
  });

  if (sortBy === 'time') {
    list.sort((a, b) => (a.minutes || 20) - (b.minutes || 20));
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name, 'hu'));
  }
  return list;
}

function randomRecipe(tier) {
  const pool = (state.aiRecipes || []).filter(r => !tier || r.tier === tier);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function addToShopping(state, item) {
  const key = norm(item.name);
  const existing = state.shopping.find(e => {
    if (e.checked) return false;
    if (item.ingredientID) return e.ingredientID === item.ingredientID;
    return !e.ingredientID && norm(e.name) === key;
  });
  if (existing) {
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
  if (recipe.isAi) return [];
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
  const ing = ING.find(i => !i.staple && i.keys.some(k => k.indexOf(q) >= 0));
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

// VALÓDI, NORMÁLIS TARTALMÚ TARTALÉK RECEPTEK HA NINCS API KULCS
function getFallbackDailyRecipes(lang = 'hu') {
  const timestamp = Date.now();
  if (lang === 'en') {
    return [
      { id: `daily_${timestamp}_1`, name: 'Creamy Garlic Chicken Breast', emoji: '🍗', tier: 'medium', minutes: 25, servings: 2, isAi: true, ing: [{ name: 'Chicken breast', amount: '500g' }, { name: 'Garlic', amount: '3 cloves' }, { name: 'Heavy cream', amount: '2 dl' }], steps: ['1. Dice the chicken breast and season with salt and pepper.', '2. Sauté in a pan until golden brown.', '3. Add minced garlic and pour in heavy cream, simmer until thick.'] },
      { id: `daily_${timestamp}_2`, name: 'Classic Bolognese Spaghetti', emoji: '🍝', tier: 'medium', minutes: 35, servings: 4, isAi: true, ing: [{ name: 'Ground beef', amount: '400g' }, { name: 'Tomato sauce', amount: '500g' }, { name: 'Spaghetti', amount: '400g' }], steps: ['1. Boil the spaghetti in salted water.', '2. Brown the ground beef, add tomato sauce and simmer for 20 mins.', '3. Serve hot with grated cheese on top.'] },
      { id: `daily_${timestamp}_3`, name: 'Quick Cottage Cheese Noodles', emoji: '🍝', tier: 'cheap', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Pasta', amount: '300g' }, { name: 'Cottage cheese', amount: '250g' }, { name: 'Bacon', amount: '150g' }, { name: 'Sour cream', amount: '150g' }], steps: ['1. Cook the pasta until al dente.', '2. Fry the diced bacon until crispy.', '3. Mix pasta with cottage cheese, sour cream, and top with crispy bacon.'] },
      { id: `daily_${timestamp}_4`, name: 'Crispy Caesar Salad', emoji: '🥗', tier: 'medium', minutes: 15, servings: 2, isAi: true, ing: [{ name: 'Romaine lettuce', amount: '1 head' }, { name: 'Chicken breast', amount: '200g' }, { name: 'Parmesan', amount: '50g' }, { name: 'Croutons', amount: '1 cup' }], steps: ['1. Grill the sliced chicken breast.', '2. Chop the lettuce and toss with dressing.', '3. Top with chicken, croutons, and shaved parmesan.'] },
      { id: `daily_${timestamp}_5`, name: 'Hearty Bean Goulash Soup', emoji: '🍲', tier: 'cheap', minutes: 40, servings: 4, isAi: true, ing: [{ name: 'Beans', amount: '400g' }, { name: 'Sausage', amount: '200g' }, { name: 'Carrots', amount: '2 pcs' }, { name: 'Sour cream', amount: '1 dl' }], steps: ['1. Sauté sliced sausage and veggies in a pot.', '2. Add beans and water, season with paprika, salt, and pepper.', '3. Simmer until tender and serve with sour cream.'] }
    ];
  }
  return [
    { id: `daily_${timestamp}_1`, name: 'Tejszínes-fokhagymás csirkemell', emoji: '🍗', tier: 'medium', minutes: 25, servings: 2, isAi: true, ing: [{ name: 'Csirkemell', amount: '50 dkg' }, { name: 'Fokhagyma', amount: '3 gerezd' }, { name: 'Főzőtejszín', amount: '2 dl' }], steps: ['1. A csirkemellet vágjuk kockákra, sózzuk, borsozzuk.', '2. Serpenyőben kevés olajon pirítsuk meg.', '3. Add hozzá a zúzott fokhagymát és öntsd fel tejszínnel, majd sűrítsd be.'] },
    { id: `daily_${timestamp}_2`, name: 'Klasszikus spagetti Bolognai módra', emoji: '🍝', tier: 'medium', minutes: 35, servings: 4, isAi: true, ing: [{ name: 'Darált hús', amount: '40 dkg' }, { name: 'Paradicsompüré', amount: '5 dl' }, { name: 'Spagetti tészta', amount: '40 dkg' }], steps: ['1. Főzd ki a spagetti tésztát sós vízben.', '2. Pirítsd meg a darált húst, öntsd fel a paradicsompürével és fűszerezd oregánóval.', '3. Főzd össze 20 perc alatt, majd tálald sajttal.'] },
    { id: `daily_${timestamp}_3`, name: 'Hagyományos túrós csusza piritott szalonnával', emoji: '🍝', tier: 'cheap', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Kockatészta', amount: '30 dkg' }, { name: 'Tehéntúró', amount: '25 dkg' }, { name: 'Szalonna', amount: '15 dkg' }, { name: 'Tejföl', amount: '15 dkg' }], steps: ['1. Főzd meg a tésztát sós vízben.', '2. A szalonnát vágd apróra és pirítsd ropogósra.', '3. Keverd össze a tésztát túróval, tejföllel, és szórd meg a sült szalonnával.'] },
    { id: `daily_${timestamp}_4`, name: 'Ropogós Cézár saláta csirkével', emoji: '🥗', tier: 'medium', minutes: 15, servings: 2, isAi: true, ing: [{ name: 'Római saláta', amount: '1 fej' }, { name: 'Csirkemell', amount: '20 dkg' }, { name: 'Parmezán sajt', amount: '5 dkg' }, { name: 'Kenyérkocka', amount: '1 csésze' }], steps: ['1. A csirkemellet csíkozd fel és pirítsd meg.', '2. A salátát tépd össze, keverd össze a dresszinggel.', '3. Halmozd rá a húst, a krutont és a reszelt parmezánt.'] },
    { id: `daily_${timestamp}_5`, name: 'Füstös csülkös bableves tejföllel', emoji: '🍲', tier: 'cheap', minutes: 40, servings: 4, isAi: true, ing: [{ name: 'Szárazbab', amount: '30 dkg' }, { name: 'Füstölt kolbász', amount: '20 dkg' }, { name: 'Sárgarépa', amount: '2 db' }, { name: 'Tejföl', amount: '1 dl' }], steps: ['1. A babot áztasd be előző este.', '2. Főzd meg a zöldségekkel és a karikára vágott kolbásszal együtt.', '3. Tálaláskor adj hozzá egy kanál tejfölt.'] }
  ];
}

async function fetchDailyAIRecipes(state) {
  const apiKey = (state.apiKey || '').trim();
  if (!apiKey) {
    return getFallbackDailyRecipes(state.lang);
  }

  const langInstruction = state.lang === 'en' 
    ? 'IMPORTANT: Generate 10 diverse, high-quality, realistic everyday recipes in ENGLISH as a strict JSON array with real dish names, detailed ingredients and steps.' 
    : 'FONTOS: Generálj 10 darab VALÓDI, NORMÁLIS nevű, részletes magyaros és nemzetközi ételreceptet (pl. milánói makaróni, rakott krumpli, gulyásleves stb.) SZIGORÚAN MAGYAR nyelven, mint egy valid JSON tömböt. Ne adj nekik unalmas sablonnevet, hanem igazi receptek legyenek!';

  const prompt = `${langInstruction}
  Format:
  [
    {
      "name": "Valódi étel neve",
      "emoji": "🍲",
      "tier": "cheap", 
      "minutes": 30,
      "servings": 4,
      "isAi": true,
      "ing": [
        {"name": "Hozzávaló 1", "amount": "50 dkg"}
      ],
      "steps": [
        "1. lépés részletes leírása"
      ]
    }
  ]
  Tier must be "cheap", "medium" or "expensive".`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) return getFallbackDailyRecipes(state.lang);

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    
    return parsed.map((r, idx) => Object.assign({}, r, {
      id: `daily_${Date.now()}_${idx}`,
      isAi: true
    }));
  } catch (err) {
    return getFallbackDailyRecipes(state.lang);
  }
}

async function checkAndRefreshDailyRecipes(state) {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (state.lastDailyDate !== todayStr || !state.aiRecipes || state.aiRecipes.length === 0) {
    const fresh = await fetchDailyAIRecipes(state);
    state.aiRecipes = fresh;
    state.lastDailyDate = todayStr;
    return true;
  }
  return false;
}

// AI RECEPT KITALÁLÁS AZ OTTHON LÉVŐ ALAPANYAGOKBÓL (EZ MARADT A FŐZZÜNK / OTTHON FÜLÖN)
async function fetchCustomAIRecipe(state) {
  const ingredients = getAllIngredientsList(state);
  const apiKey = (state.apiKey || '').trim();
  if (!apiKey) {
    throw new Error(state.lang === 'en' ? 'API key is missing in Settings!' : 'Hiányzik az API kulcs a Beállításokból!');
  }

  const langInstruction = state.lang === 'en' 
    ? `I have these ingredients at home: ${ingredients.join(', ')}. Create 1 wonderful, realistic recipe using these.` 
    : `Ezek az alapanyagok vannak otthon: ${ingredients.join(', ')}. Találj ki 1 finom, normális, valódi ételreceptet ezekből magyarul.`;

  const prompt = `${langInstruction}
  Return STRICTLY a valid JSON object (not array), format:
  {
    "name": "Étel neve",
    "emoji": "🍳",
    "tier": "cheap",
    "minutes": 25,
    "servings": 2,
    "ing": [{"name": "Alapanyag", "amount": "mennyiség"}],
    "steps": ["1. lépés"]
  }`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
  });

  if (!response.ok) throw new Error('AI hiba');
  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanJson);
  
  return Object.assign({}, parsed, {
    id: `custom_${Date.now()}`,
    isAi: true
  });
}
