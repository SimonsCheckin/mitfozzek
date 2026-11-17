'use strict';

const KEY = 'mitfozzek.v6';

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
    aiGenBtn: '✨ Kérj új receptötleteket az AI-tól!',
    aiLoading: '🤖 Mai friss receptek generálása...',
    readyRecipes: '✅ Főzhető receptek & AI ötletek',
    almostRecipes: '🛒 Majdnem kész: 1–2 dolog hiányzik',
    smartShop: '💡 Okos bevásárlás',
    moreIdeas: count => `Több ötlet mutatása (${count})`,
    noPantry: 'Még nem adtál meg alapanyagot',
    noPantryDesc: 'Add meg, mi van otthon, és összerakok belőle egy ételt.',
    favs: 'Kedvencek',
    random: '🎲 Meglepj!',
    abcSort: 'ABC sorrend',
    timeSort: '⏱ Idő szerint',
    searchIdeas: 'Napi ötletek keresése',
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
    aiBadge: '✨ Napi ötlet',
    aiGeneratedText: 'Mesterséges intelligencia által generált napi recept',
    missingText: 'Hiányzik:',
    optionalText: 'elhagyható / bónusz',
    backBtn: '‹ Vissza',
    dailyNotice: 'Friss napi ajánlat (minden reggel automatikusan frissül)'
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
    aiGenBtn: '✨ Ask AI for new recipe ideas!',
    aiLoading: '🤖 Generating today fresh recipes...',
    readyRecipes: '✅ Cookable recipes & AI ideas',
    almostRecipes: '🛒 Almost ready: 1–2 items missing',
    smartShop: '💡 Smart Shopping',
    moreIdeas: count => `Show more ideas (${count})`,
    noPantry: 'No ingredients added yet',
    noPantryDesc: 'Add what you have at home, and I will find a recipe for you.',
    favs: 'Favorites',
    random: '🎲 Surprise me!',
    abcSort: 'Alphabetical',
    timeSort: '⏱ By time',
    searchIdeas: 'Search daily ideas',
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
    aiBadge: '✨ Daily idea',
    aiGeneratedText: 'Generated daily recipe by Artificial Intelligence',
    missingText: 'Missing:',
    optionalText: 'optional / bonus',
    backBtn: '‹ Back',
    dailyNotice: 'Fresh daily selection (updates automatically every morning)'
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
  const allRecipes = (state.aiRecipes || []).concat(RECIPES);
  
  for (const recipe of allRecipes) {
    if (tier && recipe.tier !== tier) continue;
    
    if (recipe.isAi) {
      out.push({ recipe, have: recipe.ing, missing: [] });
      continue;
    }

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
    if (a.recipe.isAi && !b.recipe.isAi) return -1;
    if (!a.recipe.isAi && b.recipe.isAi) return 1;
    return (a.missing.length - b.missing.length) ||
           (b.have.length - a.have.length) ||
           a.recipe.name.localeCompare(b.recipe.name, 'hu');
  });
  return out;
}

function unlockSuggestions(state, tier, limit) {
  const buckets = {};
  for (const m of matches(state, tier)) {
    if (!m.recipe.isAi && m.missing.length === 1) {
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
    return r.ing.some(x => {
      if (x.id && ING_BY_ID[x.id]) return ING_BY_ID[x.id].keys.some(k => k.indexOf(q) >= 0);
      return norm(x.name || '').indexOf(q) >= 0;
    });
  });

  if (sortBy === 'time') {
    list.sort((a, b) => (a.minutes || 20) - (b.minutes || 20));
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name, 'hu'));
  }
  return list;
}

function randomRecipe(tier) {
  const pool = state.aiRecipes.filter(r => !tier || r.tier === tier);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getFallbackDailyRecipes(lang = 'hu') {
  const timestamp = Date.now();
  if (lang === 'en') {
    return Array.from({ length: 18 }, (_, idx) => ({
      id: `daily_${timestamp}_${idx}`,
      name: `Daily Recipe #${idx + 1}`,
      emoji: ['🍲', '🍳', '🥗', '🍝', '🍗', '🍜', '🍛', '🥘'][idx % 8],
      tier: idx % 3 === 0 ? 'cheap' : idx % 3 === 1 ? 'medium' : 'expensive',
      minutes: 15 + (idx * 5) % 35,
      servings: 2,
      isAi: true,
      ing: [{ name: 'Mixed vegetables', amount: '300g' }, { name: 'Olive oil', amount: '2 tbsp' }],
      steps: [`1. Prepare ingredients.`, `2. Cook thoroughly for ${15 + (idx * 5) % 35} minutes.`]
    }));
  }
  return Array.from({ length: 18 }, (_, idx) => ({
    id: `daily_${timestamp}_${idx}`,
    name: `Napi Recept #${idx + 1}`,
    emoji: ['🍲', '🍳', '🥗', '🍝', '🍗', '🍜', '🍛', '🥘'][idx % 8],
    tier: idx % 3 === 0 ? 'cheap' : idx % 3 === 1 ? 'medium' : 'expensive',
    minutes: 15 + (idx * 5) % 35,
    servings: 2,
    isAi: true,
    ing: [{ name: 'Vegyes zöldség', amount: '30 dkg' }, { name: 'Olívaolaj', amount: '2 ek' }],
    steps: [`1. Készítsd elő az alapanyagokat.`, `2. Főzd készre ${15 + (idx * 5) % 35} perc alatt.`]
  }));
}

async function fetchDailyAIRecipes(state) {
  const apiKey = (state.apiKey || '').trim();
  if (!apiKey) {
    return getFallbackDailyRecipes(state.lang);
  }

  const langInstruction = state.lang === 'en' 
    ? 'IMPORTANT: Generate 18 diverse, creative daily recipes in ENGLISH as a strict JSON array.' 
    : 'FONTOS: Generálj 18 különböző, változatos, izgalmas napi receptet SZIGORÚAN MAGYAR nyelven, mint egy valid JSON tömböt.';

  const prompt = `${langInstruction}
  Format:
  [
    {
      "name": "Recipe name",
      "emoji": "🍲",
      "tier": "cheap", 
      "minutes": 25,
      "servings": 2,
      "isAi": true,
      "ing": [
        {"name": "Ingredient 1", "amount": "1 pc"}
      ],
      "steps": [
        "Step 1 description"
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