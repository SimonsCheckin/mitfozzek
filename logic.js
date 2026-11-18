'use strict';

const KEY = 'mitfozzek.v10';

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
    aiLoading: '🤖 Részletes recept ötletelés...',
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
    aiGeneratedText: 'Mesterséges intelligencia által generált részletes recept',
    missingText: 'Hiányzik:',
    optionalText: 'elhagyható / bónusz',
    backBtn: '‹ Vissza',
    dailyNotice: 'Friss napi receptmagazin (pontosan 5 olcsó, 5 közepes és 5 drága fogás)'
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
    aiLoading: '🤖 Brainstorming detailed recipe...',
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
    aiGeneratedText: 'Detailed recipe generated by Artificial Intelligence',
    missingText: 'Missing:',
    optionalText: 'optional / bonus',
    backBtn: '‹ Back',
    dailyNotice: 'Fresh daily recipe magazine (exactly 5 cheap, 5 medium and 5 expensive dishes)'
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
    favorites: [],      // ID-k listája
    favoriteRecipes: [], // Mentett teljes recept objektumok, hogy soha ne tűnjenek el!
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
    const parsed = Object.assign(defaultState(), JSON.parse(raw));
    if (!parsed.favoriteRecipes) parsed.favoriteRecipes = [];
    return parsed;
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

function getAllIngredientsList(state) {
  const names = [];
  state.pantry.forEach(id => { if (ING_BY_ID[id]) names.push(ING_BY_ID[id].name); });
  state.custom.forEach(c => names.push(c));
  return names;
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
  // Ha a kedvenc nézet van bekapcsolva, a elmentett receptekből szűrünk, különben a napi AI receptekből
  const sourcePool = favOnly ? (state.favoriteRecipes || []) : (state.aiRecipes || []);
  
  const list = sourcePool.filter(r => {
    if (tier && r.tier !== tier) return false;
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

function getFallbackDailyRecipes(lang = 'hu') {
  const timestamp = Date.now();
  if (lang === 'en') {
    return [
      { id: `daily_${timestamp}_c1`, name: 'Traditional Cottage Cheese Noodles', emoji: '🍝', tier: 'cheap', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Pasta', amount: '350g' }, { name: 'Cottage cheese', amount: '250g' }, { name: 'Bacon', amount: '150g' }, { name: 'Sour cream', amount: '200g' }], steps: ['1. Cook pasta.', '2. Fry bacon.', '3. Mix with cottage cheese and sour cream.'] },
      { id: `daily_${timestamp}_c2`, name: 'Garlic Potato Cream Soup', emoji: '🍲', tier: 'cheap', minutes: 25, servings: 4, isAi: true, ing: [{ name: 'Potatoes', amount: '600g' }, { name: 'Garlic', amount: '4 cloves' }, { name: 'Broth', amount: '1l' }, { name: 'Bread croutons', amount: '1 cup' }], steps: ['1. Boil potatoes and garlic in broth.', '2. Blend until smooth.', '3. Serve with croutons.'] },
      { id: `daily_${timestamp}_c3`, name: 'Classic Fried Eggs with Tomato Salad', emoji: '🍳', tier: 'cheap', minutes: 15, servings: 2, isAi: true, ing: [{ name: 'Eggs', amount: '4 pcs' }, { name: 'Tomatoes', amount: '3 pcs' }, { name: 'Onion', amount: '1 pc' }], steps: ['1. Fry eggs sunny side up.', '2. Slice tomatoes and onions for salad.', '3. Serve together.'] },
      { id: `daily_${timestamp}_c4`, name: 'Semolina Porridge with Cocoa', emoji: '🥣', tier: 'cheap', minutes: 10, servings: 2, isAi: true, ing: [{ name: 'Milk', amount: '5dl' }, { name: 'Semolina', amount: '4 tbsp' }, { name: 'Sugar', amount: '2 tbsp' }, { name: 'Cocoa powder', amount: '1 tbsp' }], steps: ['1. Heat milk and whisk in semolina and sugar.', '2. Cook until thick.', '3. Dust with cocoa powder.'] },
      { id: `daily_${timestamp}_c5`, name: 'Butter and Cheese Toast', emoji: '🍞', tier: 'cheap', minutes: 10, servings: 2, isAi: true, ing: [{ name: 'Bread', amount: '4 slices' }, { name: 'Butter', amount: '50g' }, { name: 'Cheese', amount: '100g' }], steps: ['1. Butter bread slices.', '2. Top with grated cheese.', '3. Bake in oven until melted.'] },
      { id: `daily_${timestamp}_m1`, name: 'Creamy Garlic Chicken Breast with Rice', emoji: '🍗', tier: 'medium', minutes: 30, servings: 2, isAi: true, ing: [{ name: 'Chicken breast', amount: '500g' }, { name: 'Garlic', amount: '3 cloves' }, { name: 'Heavy cream', amount: '2 dl' }, { name: 'Rice', amount: '250g' }], steps: ['1. Cook rice.', '2. Sauté chicken breast.', '3. Add garlic and heavy cream, simmer until thick.'] },
      { id: `daily_${timestamp}_m2`, name: 'Classic Bolognese Spaghetti', emoji: '🍝', tier: 'medium', minutes: 40, servings: 4, isAi: true, ing: [{ name: 'Ground beef', amount: '500g' }, { name: 'Tomato paste', amount: '700g' }, { name: 'Spaghetti', amount: '400g' }], steps: ['1. Brown ground beef.', '2. Add tomato sauce and simmer.', '3. Serve with spaghetti.'] },
      { id: `daily_${timestamp}_m3`, name: 'Crispy Chicken Caesar Salad', emoji: '🥗', tier: 'medium', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Romaine lettuce', amount: '1 head' }, { name: 'Chicken breast', amount: '300g' }, { name: 'Parmesan', amount: '60g' }], steps: ['1. Grill chicken breast.', '2. Toss lettuce with dressing.', '3. Top with chicken and parmesan.'] },
      { id: `daily_${timestamp}_m4`, name: 'Pan-Seared Pork Chops with Mashed Potatoes', emoji: '🥩', tier: 'medium', minutes: 35, servings: 2, isAi: true, ing: [{ name: 'Pork chops', amount: '2 pcs' }, { name: 'Potatoes', amount: '600g' }, { name: 'Butter', amount: '40g' }], steps: ['1. Fry pork chops until tender.', '2. Mash boiled potatoes with butter and milk.', '3. Serve hot.'] },
      { id: `daily_${timestamp}_m5`, name: 'Creamy Mushroom Pasta', emoji: '🍝', tier: 'medium', minutes: 25, servings: 2, isAi: true, ing: [{ name: 'Mushrooms', amount: '400g' }, { name: 'Pasta', amount: '300g' }, { name: 'Cooking cream', amount: '2 dl' }], steps: ['1. Sauté sliced mushrooms.', '2. Add cream and simmer.', '3. Toss with cooked pasta.'] },
      { id: `daily_${timestamp}_e1`, name: 'Pan-Seared Salmon with Lemon Butter Sauce', emoji: '🐟', tier: 'expensive', minutes: 25, servings: 2, isAi: true, ing: [{ name: 'Salmon fillet', amount: '500g' }, { name: 'Lemon', amount: '1 pc' }, { name: 'Butter', amount: '50g' }, { name: 'Asparagus', amount: '300g' }], steps: ['1. Sear salmon skin-side down.', '2. Steam asparagus.', '3. Make lemon butter sauce and drizzle over.'] },
      { id: `daily_${timestamp}_e2`, name: 'Beef Tenderloin Steak with Pepper Sauce', emoji: '🥩', tier: 'expensive', minutes: 30, servings: 2, isAi: true, ing: [{ name: 'Beef steak', amount: '400g' }, { name: 'Green peppercorns', amount: '2 tbsp' }, { name: 'Heavy cream', amount: '1.5 dl' }, { name: 'Brandy', amount: '1 shot' }], steps: ['1. Sear steak to preferred doneness.', '2. Deglaze pan with brandy and cream, add peppercorns.', '3. Serve steak with sauce.'] },
      { id: `daily_${timestamp}_e3`, name: 'Shrimp Scampi with Garlic and White Wine', emoji: '🦐', tier: 'expensive', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Shrimp', amount: '400g' }, { name: 'White wine', amount: '1 dl' }, { name: 'Garlic', amount: '4 cloves' }, { name: 'Pasta', amount: '250g' }], steps: ['1. Sauté garlic and shrimp.', '2. Pour in white wine and reduce.', '3. Toss with cooked pasta.'] },
      { id: `daily_${timestamp}_e4`, name: 'Duck Breast with Orange Glaze', emoji: '🦆', tier: 'expensive', minutes: 40, servings: 2, isAi: true, ing: [{ name: 'Duck breast', amount: '2 pcs' }, { name: 'Oranges', amount: '2 pcs' }, { name: 'Honey', amount: '2 tbsp' }], steps: ['1. Score duck skin and pan-sear until crispy.', '2. Make orange honey glaze.', '3. Slice duck and drizzle with glaze.'] },
      { id: `daily_${timestamp}_e5`, name: 'Truffle Oil Mushroom Risotto', emoji: '🍚', tier: 'expensive', minutes: 35, servings: 2, isAi: true, ing: [{ name: 'Arborio rice', amount: '250g' }, { name: 'Mushrooms', amount: '250g' }, { name: 'Truffle oil', amount: '1 tsp' }, { name: 'Parmesan', amount: '80g' }], steps: ['1. Sauté mushrooms and toast rice.', '2. Gradually add broth while stirring.', '3. Finish with parmesan and truffle oil.'] }
    ];
  }
  return [
    { id: `daily_${timestamp}_c1`, name: 'Hagyományos túrós csusza piritott szalonnával', emoji: '🍝', tier: 'cheap', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Kockatészta', amount: '35 dkg' }, { name: 'Tehéntúró', amount: '25 dkg' }, { name: 'Szalonna', amount: '15 dkg' }, { name: 'Tejföl', amount: '20 dkg' }], steps: ['1. Főzd ki a tésztát.', '2. Pirítsd meg a szalonnát.', '3. Keverd össze túróval, tejföllel és a szalonnával.'] },
    { id: `daily_${timestamp}_c2`, name: 'Hagymás-krumplis tojásos lecsó', emoji: '🍳', tier: 'cheap', minutes: 25, servings: 3, isAi: true, ing: [{ name: 'Krumpli', amount: '50 dkg' }, { name: 'Tojás', amount: '4 db' }, { name: 'Hagyma', amount: '2 db' }], steps: ['1. Dinszteld meg a hagymát.', '2. Add hozzá a kockázott krumplit.', '3. Üsd rá a tojásokat.'] },
    { id: `daily_${timestamp}_c3`, name: 'Tejfölös-fokhagymás tészta', emoji: '🍝', tier: 'cheap', minutes: 15, servings: 2, isAi: true, ing: [{ name: 'Spagetti', amount: '30 dkg' }, { name: 'Tejföl', amount: '2 dl' }, { name: 'Fokhagyma', amount: '2 gerezd' }, { name: 'Sajt', amount: '10 dkg' }], steps: ['1. Főzd ki a tésztát.', '2. Keverd össze tejföllel és fokhagymával.', '3. Szórd meg sajttal.'] },
    { id: `daily_${timestamp}_c4`, name: 'Kakaós darás tészta', emoji: '🍝', tier: 'cheap', minutes: 15, servings: 2, isAi: true, ing: [{ name: 'Száraztészta', amount: '30 dkg' }, { name: 'Búzadara', amount: '10 dkg' }, { name: 'Kakaópor', amount: '3 ek' }], steps: ['1. Főzd ki a tésztát.', '2. Pirítsd meg a darát.', '3. Keverd össze kakaóval.'] },
    { id: `daily_${timestamp}_c5`, name: 'Sajtos-majonézes melegszendvics', emoji: '🥪', tier: 'cheap', minutes: 10, servings: 2, isAi: true, ing: [{ name: 'Kenyér', amount: '4 szelet' }, { name: 'Sajt', amount: '10 dkg' }, { name: 'Majonéz', amount: '2 ek' }], steps: ['1. Keverd össze a sajtot majonézzel.', '2. Kend a kenyérre.', '3. Süsd meg.'] },
    { id: `daily_${timestamp}_m1`, name: 'Tejszínes-fokhagymás csirkemell rizzsel', emoji: '🍗', tier: 'medium', minutes: 30, servings: 2, isAi: true, ing: [{ name: 'Csirkemell', amount: '50 dkg' }, { name: 'Fokhagyma', amount: '3 gerezd' }, { name: 'Főzőtejszín', amount: '2 dl' }, { name: 'Rizs', amount: '20 dkg' }], steps: ['1. Készítsd el a rizst.', '2. Pirítsd meg a csirkét.', '3. Öntsd fel tejszínnel.'] },
    { id: `daily_${timestamp}_m2`, name: 'Klasszikus spagetti Bolognai módra', emoji: '🍝', tier: 'medium', minutes: 40, servings: 4, isAi: true, ing: [{ name: 'Darált hús', amount: '50 dkg' }, { name: 'Paradicsompüré', amount: '700 g' }, { name: 'Spagetti', amount: '40 dkg' }], steps: ['1. Pirítsd meg a húst.', '2. Add hozzá a paradicsompürét.', '3. Főzd össze.'] },
    { id: `daily_${timestamp}_m3`, name: 'Ropogós Cézár saláta csirkével', emoji: '🥗', tier: 'medium', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Római saláta', amount: '1 fej' }, { name: 'Csirkemell', amount: '30 dkg' }, { name: 'Parmezán', amount: '6 dkg' }], steps: ['1. Grillezd meg a csirkét.', '2. Keverd össze a salátát.', '3. Szórd meg sajttal.'] },
    { id: `daily_${timestamp}_m4`, name: 'Brassói aprópecsenye sült krumplival', emoji: '🥩', tier: 'medium', minutes: 45, servings: 3, isAi: true, ing: [{ name: 'Sertéscomb', amount: '60 dkg' }, { name: 'Krumpli', amount: '80 dkg' }], steps: ['1. Pirítsd meg a húst.', '2. Süsd meg a krumplit.', '3. Keverd össze.'] },
    { id: `daily_${timestamp}_m5`, name: 'Tejszínes gombás csirkeragu', emoji: '🍄', tier: 'medium', minutes: 30, servings: 2, isAi: true, ing: [{ name: 'Gomba', amount: '40 dkg' }, { name: 'Csirkemell', amount: '40 dkg' }, { name: 'Tejszín', amount: '2 dl' }], steps: ['1. Pirítsd meg a húst és gombát.', '2. Öntsd fel tejszínnel.', '3. Főzd sűrűre.'] },
    { id: `daily_${timestamp}_e1`, name: 'Vajas-citrusos sült lazac spárgával', emoji: '🐟', tier: 'expensive', minutes: 25, servings: 2, isAi: true, ing: [{ name: 'Lazacfilé', amount: '50 dkg' }, { name: 'Citrom', amount: '1 db' }, { name: 'Vaj', amount: '50 g' }, { name: 'Spárga', amount: '30 dkg' }], steps: ['1. Süsd meg a lazacot.', '2. Párold meg a spárgát.', '3. Locsold meg vajmártással.'] },
    { id: `daily_${timestamp}_e2`, name: 'Bélszínsteak zöldborsmártással', emoji: '🥩', tier: 'expensive', minutes: 30, servings: 2, isAi: true, ing: [{ name: 'Bélszín', amount: '40 dkg' }, { name: 'Zöldbors', amount: '2 ek' }, { name: 'Tejszín', amount: '1.5 dl' }], steps: ['1. Süsd meg a steaket.', '2. Készíts zöldborsmártást.', '3. Tálald együtt.'] },
    { id: `daily_${timestamp}_e3`, name: 'Fokhagymás-boros garnélarák tésztával', emoji: '🦐', tier: 'expensive', minutes: 20, servings: 2, isAi: true, ing: [{ name: 'Garnélarák', amount: '40 dkg' }, { name: 'Fehérbor', amount: '1 dl' }, { name: 'Fokhagyma', amount: '4 gerezd' }], steps: ['1. Pirítsd meg a rákot.', '2. Öntsd fel borral.', '3. Forgasd tésztába.'] },
    { id: `daily_${timestamp}_e4`, name: 'Rozmaringos kacsamell narancsmártással', emoji: '🦆', tier: 'expensive', minutes: 40, servings: 2, isAi: true, ing: [{ name: 'Kacsamell', amount: '2 db' }, { name: 'Narancs', amount: '2 db' }], steps: ['1. Süsd ropogósra a kacsát.', '2. Készíts narancsmártást.', '3. Szeleteld fel.'] },
    { id: `daily_${timestamp}_e5`, name: 'Szarvasolajos vargányás rizottó', emoji: '🍚', tier: 'expensive', minutes: 35, servings: 2, isAi: true, ing: [{ name: 'Rizottó rizs', amount: '250 g' }, { name: 'Vargánya', amount: '200 g' }, { name: 'Parmezán', amount: '80 g' }], steps: ['1. Pirítsd meg a gombát és rizst.', '2. Adagolj alaplevet.', '3. Keverd bele a parmezánt.'] }
  ];
}

async function fetchDailyAIRecipes(state) {
  const apiKey = (state.apiKey || '').trim();
  if (!apiKey) {
    return getFallbackDailyRecipes(state.lang);
  }

  const langInstruction = state.lang === 'en' 
    ? 'IMPORTANT: Generate EXACTLY 15 diverse recipes in ENGLISH as a strict JSON array: exactly 5 cheap ("cheap"), 5 medium ("medium"), and 5 expensive ("expensive") recipes.' 
    : 'FONTOS: Generálj PONTOSAN 15 darab változatos receptet SZIGORÚAN MAGYAR nyelven, mint egy valid JSON tömböt. Pontosan 5 olcsó ("cheap"), 5 közepes ("medium"), és 5 drága ("expensive") recept legyen.';

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
      "ing": [{"name": "Hozzávaló", "amount": "mennyiség"}],
      "steps": ["1. lépés", "2. lépés"]
    }
  ]`;

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

async function fetchCustomAIRecipe(state) {
  const ingredients = getAllIngredientsList(state);
  const apiKey = (state.apiKey || '').trim();
  if (!apiKey) {
    throw new Error(state.lang === 'en' ? 'API key is missing in Settings!' : 'Hiányzik az API kulcs a Beállításokból!');
  }

  const langInstruction = state.lang === 'en' 
    ? `I have these ingredients at home: ${ingredients.join(', ')}. Create 1 wonderful, detailed, realistic recipe using these.` 
    : `Ezek az alapanyagok vannak otthon: ${ingredients.join(', ')}. Találj ki 1 finom, normális, valódi ételreceptet ezekből magyarul.`;

  const prompt = `${langInstruction}
  Return STRICTLY a valid JSON object, format:
  {
    "name": "Étel neve",
    "emoji": "🍳",
    "tier": "cheap",
    "minutes": 30,
    "servings": 2,
    "ing": [{"name": "Alapanyag", "amount": "mennyiség"}],
    "steps": ["1. lépés", "2. lépés"]
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
