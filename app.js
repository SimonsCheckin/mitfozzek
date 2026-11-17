'use strict';

const state = loadState(localStorage);
const ui = {
  tab: 'home',
  tier: null,
  ideaSort: 'name',
  search: '',
  favOnly: false,
  recipeId: null,
  servings: 0,
  scroll: 0,
  customAiLoading: false
};

const $view = document.getElementById('view');
const $tabbar = document.getElementById('tabbar');
const $toast = document.getElementById('toast');

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function persist() { saveState(localStorage, state); }

let toastTimer = null;
function toast(msg) {
  if (!$toast) return;
  $toast.textContent = msg;
  $toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $toast.classList.remove('show'), 1800);
}

async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(text); toast(state.lang === 'en' ? 'Copied to clipboard' : 'Vágólapra másolva'); }
  catch (e) { window.prompt('Copy:', text); }
}

function chip(id, emoji, title, on, act, extra) {
  return `<button class="chip ${on ? 'on' : ''}" data-act="${act}" data-id="${esc(id)}">${emoji} ${esc(title)}${on ? (extra || ' ✓') : ''}</button>`;
}

function tierBadge(tier) {
  const tObj = TIERS[tier] || TIERS.cheap;
  const label = typeof tObj.title === 'object' ? tObj.title[state.lang] || tObj.title.hu : tObj.title;
  return `<span class="badge" style="--c:${tObj.color}">${tObj.dots} ${label}</span>`;
}

function segmented() {
  const opts = [[null, state.lang === 'en' ? 'All' : 'Mind']].concat(TIER_ORDER.map(k => [k, TIERS[k].title[state.lang] || TIERS[k].title.hu]));
  const hint = ui.tier ? (TIERS[ui.tier].hint[state.lang] || TIERS[ui.tier].hint.hu) : (state.lang === 'en' ? 'All price categories' : 'Minden árkategória');
  return `<div class="seg">${opts.map(([k, label]) =>
    `<button class="${ui.tier === k ? 'active' : ''}" data-act="tier" data-v="${k || ''}">${label}</button>`).join('')}</div>
    <p class="hint">${hint}</p>`;
}

function emptyState(emoji, title, msg, btnLabel, act) {
  return `<div class="empty"><div class="big">${emoji}</div><h2>${title}</h2><p>${msg}</p>
    <button class="primary" data-act="${act}">${btnLabel}</button></div>`;
}

function suggHTML() {
  if (!ui.query || !ui.query.trim()) return '';
  const list = suggestions(ui.query);
  let html = '';
  if (!list.length) html += `<p class="muted">${state.lang === 'en' ? 'No such ingredient.' : 'Nincs ilyen a listában.'}</p>`;
  else html += `<div class="chips">${list.map(i => chip(i.id, i.emoji, i.name, state.pantry.indexOf(i.id) >= 0, 'addSugg')).join('')}</div>`;
  if (!exactMatchExists(ui.query)) {
    html += `<button class="secondary" data-act="commitTyped">＋ ${state.lang === 'en' ? 'Add custom:' : 'Hozzáadás saját alapanyagként:'} ${esc(ui.query.trim())}</button>`;
  }
  return html;
}

function homeView() {
  const selected = ING.filter(i => state.pantry.indexOf(i.id) >= 0);
  const count = pantryCount(state);
  let html = `<header class="top"><h1>${t('homeTitle', state.lang)}</h1>
    <span><button class="link" data-act="tab" data-v="settings">⚙️</button>
    <button class="link" data-act="clearPantry" ${count ? '' : 'disabled'}>${t('clearBtn', state.lang)}</button></span></header>
    <form class="search" data-form="pantryAdd">
      <span>🔍</span>
      <input id="q" type="search" placeholder="${t('searchHome', state.lang)}" autocomplete="off" value="${esc(ui.query || '')}">
    </form>
    <div id="sugg">${suggHTML()}</div>`;

  if (count) {
    html += `<section><h3>${t('pantryHeader', state.lang)} (${count})</h3><div class="chips">
      ${selected.map(i => chip(i.id, i.emoji, i.name, true, 'toggle', ' ✕')).join('')}
      ${state.custom.map(c => chip(c, '✏️', c, true, 'removeCustom', ' ✕')).join('')}
    </div></section>`;
  }

  for (const cat of CATEGORIES) {
    const items = ING.filter(i => i.cat === cat.id && !i.staple);
    const catTitle = typeof cat.title === 'object' ? cat.title[state.lang] || cat.title.hu : cat.title;
    html += `<section><h3>${cat.emoji} ${catTitle}</h3><div class="chips">
      ${items.map(i => chip(i.id, i.emoji, i.name, state.pantry.indexOf(i.id) >= 0, 'toggle')).join('')}
    </div></section>`;
  }
  html += `<p class="muted small">${t('stapleNote', state.lang)}</p>
    <div class="cta"><button class="primary wide" data-act="goResults" ${count ? '' : 'disabled'}>
      🍳 ${count ? t('ctaCook', state.lang, count) : t('ctaChoose', state.lang)}</button></div>`;
  return html;
}

function matchRow(m) {
  const r = m.recipe;
  const missText = m.missing && m.missing.length ? m.missing.map(x => ING_BY_ID[x.id].name.toLowerCase()).join(', ') : '';
  const statusText = m.missing.length ? `${t('missingText', state.lang)} ${esc(missText)}` : t('allHave', state.lang);

  return `<button class="row" data-act="open" data-id="${r.id}">
    <span class="emoji">${r.emoji}</span>
    <span class="grow"><strong>${esc(r.name)}</strong>
      <span class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes || 20}m</span></span>
      <span class="${m.missing.length ? 'warn' : 'ok'}">${statusText}</span>
    </span><span class="chev">›</span></button>`;
}

function recipeSection(title, items) {
  if (!items.length) return '';
  return `<section><h3>${title}</h3><div class="card">${items.map(matchRow).join('')}</div></section>`;
}

function resultsView() {
  let html = `<header class="top"><h1>${t('resultsTitle', state.lang)}</h1>
    <button class="link" data-act="tab" data-v="settings">⚙️</button></header>`;
  
  if (pantryCount(state) === 0) {
    return html + emptyState('🧺', t('noPantry', state.lang), t('noPantryDesc', state.lang), t('ctaChoose', state.lang), 'goHome');
  }

  const all = matches(state, ui.tier, ui.sortBy || 'missing');
  const ready = all.filter(m => m.missing.length === 0);
  const almost = all.filter(m => m.missing.length === 1 || m.missing.length === 2);
  const tips = unlockSuggestions(state, ui.tier, 3);

  html += segmented();
  
  html += `<div class="seg" style="margin-top: 10px;">
    <button class="${(ui.sortBy || 'missing') === 'missing' ? 'active' : ''}" data-act="sort" data-v="missing">${t('sortMissing', state.lang)}</button>
    <button class="${ui.sortBy === 'time' ? 'active' : ''}" data-act="sort" data-v="time">${t('sortTime', state.lang)}</button>
  </div>`;

  html += `<div style="margin: 14px 0;">
    <button class="primary wide" data-act="generateCustomAI" ${ui.customAiLoading ? 'disabled' : ''}>
      ${ui.customAiLoading ? t('aiLoading', state.lang) : t('aiGenBtn', state.lang)}
    </button>
  </div>`;

  html += recipeSection(t('readyRecipes', state.lang), ready);
  html += recipeSection(t('almostRecipes', state.lang), almost);
  
  if (tips.length) {
    html += `<section><h3>${t('smartShop', state.lang)}</h3><div class="card">${tips.map(tItem => `
      <div class="row static"><span class="emoji">${tItem.ingredient.emoji}</span>
        <span class="grow"><strong>${state.lang === 'en' ? 'Buy:' : 'Vegyél:'} ${esc(tItem.ingredient.name)}</strong>
        <span class="muted small">${tItem.names.length} recipes</span></span></div>`).join('')}
    </div></section>`;
  }
  return html;
}

function ideaListHTML() {
  const list = ideas(state, ui.tier, ui.search, ui.favOnly, ui.ideaSort);
  if (!list.length) return `<p class="muted card pad">${ui.favOnly ? 'Nincs kedvenc.' : 'Nincs találat.'}</p>`;
  return `<section><div class="card">${list.map(r => `
    <button class="row" data-act="open" data-id="${r.id}">
      <span class="emoji">${r.emoji}</span>
      <span class="grow"><strong>${esc(r.name)}</strong> <span class="badge" style="--c:#f97316">${t('aiBadge', state.lang)}</span>
        <span class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes || 20}m</span></span></span>
      ${state.favorites.indexOf(r.id) >= 0 ? '<span class="pink">♥</span>' : ''}<span class="chev">›</span>
    </button>`).join('')}</div></section>`;
}

function ideasView() {
  return `<header class="top"><h1>${t('ideasTitle', state.lang)}</h1>
      <span><button class="link" data-act="favOnly">${ui.favOnly ? '♥ ' + t('favs', state.lang) : '♡ ' + t('favs', state.lang)}</button>
      <button class="link" data-act="random">${t('random', state.lang)}</button></span></header>
    <p class="muted" style="font-size:13px; margin: 4px 0 10px 2px;">📅 ${t('dailyNotice', state.lang)}</p>
    ${segmented()}

    <div class="seg" style="margin-top: 10px;">
      <button class="${ui.ideaSort === 'name' ? 'active' : ''}" data-act="ideaSort" data-v="name">${t('abcSort', state.lang)}</button>
      <button class="${ui.ideaSort === 'time' ? 'active' : ''}" data-act="ideaSort" data-v="time">${t('timeSort', state.lang)}</button>
    </div>
    <form class="search" data-form="noop"><span>🔍</span>
      <input id="s" type="search" placeholder="${t('searchIdeas', state.lang)}" autocomplete="off" value="${esc(ui.search || '')}">
    </form>
    <div id="ideaList">${ideaListHTML()}</div>`;
}

// JAVÍTVA: BÁRMILYEN RECEPTET MEGTALÁL (STATIKUS ÉS AI IS)
function findRecipeAnywhere(id) {
  if (RECIPE_BY_ID[id]) return RECIPE_BY_ID[id];
  if (state.aiRecipes) {
    const found = state.aiRecipes.find(r => r.id === id);
    if (found) return found;
  }
  return null;
}

function detailView() {
  const r = findRecipeAnywhere(ui.recipeId);
  if (!r) return `<div class="detailbar"><button class="link" data-act="back">${t('backBtn', state.lang)}</button></div><p class="pad">Nem található.</p>`;

  const factor = ui.servings / Math.max(r.servings, 1);
  const fav = state.favorites.indexOf(r.id) >= 0;

  const rows = r.ing.map(x => {
    let emoji = '🍲';
    let name = x.name;
    let have = true;
    if (x.id && ING_BY_ID[x.id]) {
      const ing = ING_BY_ID[x.id];
      emoji = ing.emoji;
      name = ing.name;
      have = has(state, x.id);
    }
    const icon = r.isAi ? '<span class="ok">✨</span>' : (have ? '<span class="ok">✔</span>' : x.opt ? '<span class="muted">◌</span>' : '<span class="warn">🛒</span>');
    return `<div class="ingrow">${icon}
      <span class="grow">${emoji} ${esc(name)}</span>
      <span class="muted amount">${esc(AM.scale(x.amount, factor))}</span></div>`;
  }).join('');

  return `<div class="detailbar"><button class="link" data-act="back">${t('backBtn', state.lang)}</button>
      <strong class="ellipsis">${esc(r.name)}</strong>
      <button class="heart ${fav ? 'on' : ''}" data-act="fav" data-id="${r.id}">${fav ? '♥' : '♡'}</button></div>
    <div class="detail">
      <div class="hero">${r.emoji}</div>
      <h1>${esc(r.name)}</h1>
      <p class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes || 20}m</span></p>

      <h2>${t('ingredients', state.lang)}</h2>
      <div class="stepper"><span>👥 <strong>${ui.servings} ${t('servings', state.lang)}</strong></span>
        <span><button data-act="srv" data-d="-1" ${ui.servings <= 1 ? 'disabled' : ''}>−</button>
        <button data-act="srv" data-d="1" ${ui.servings >= 12 ? 'disabled' : ''}>+</button></span></div>
      <div class="ings">${rows}</div>
      ${r.isAi ? `<p class="ok">✨ ${t('aiGeneratedText', state.lang)}</p>` : ''}

      <h2>${t('steps', state.lang)}</h2>
      <ol class="steps">${r.steps.map(s => `<li><span class="num"></span><span>${esc(s)}</span></li>`).join('')}</ol>
    </div>`;
}

function settingsView() {
  return `<header class="top"><button class="link" data-act="tab" data-v="home">${t('backBtn', state.lang)}</button><h1>${t('settingsTitle', state.lang)}</h1></header>
    <div class="card pad" style="margin-top: 14px;">
      <h3>${t('langLabel', state.lang)}</h3>
      <div class="seg" style="margin-top: 12px;">
        <button class="${state.lang === 'hu' ? 'active' : ''}" data-act="setLang" data-v="hu">🇭🇺 Magyar</button>
        <button class="${state.lang === 'en' ? 'active' : ''}" data-act="setLang" data-v="en">🇬🇧 English</button>
      </div>
    </div>
    
    <div class="card pad" style="margin-top: 14px;">
      <h3>${t('apiKeyLabel', state.lang)}</h3>
      <p class="muted small" style="margin: 6px 0 10px 0;">${t('apiKeyHint', state.lang)}</p>
      <form data-form="saveApiKey" style="display:flex; flex-direction:column; gap:8px;">
        <input id="apikeyInput" type="text" placeholder="AIzaSy..." value="${esc(state.apiKey || '')}" style="width:100%; padding:10px; border-radius:8px; border:1px solid var(--line); background:var(--bg); color:var(--text); font-family:monospace;">
        <button class="primary" type="submit" style="margin-top:4px;">${t('saveKeyBtn', state.lang)}</button>
      </form>
    </div>`;
}

function shopRow(item) {
  const ing = item.ingredientID ? ING_BY_ID[item.ingredientID] : null;
  return `<div class="row static ${item.checked ? 'done' : ''}">
    <button class="check" data-act="shopToggle" data-id="${item.id}">${item.checked ? '✅' : '⚪️'}</button>
    <span class="grow" data-act="shopToggle" data-id="${item.id}"><span class="name">${ing ? ing.emoji + ' ' : ''}${esc(item.name)}</span></span>
    ${item.amount ? `<span class="muted amount">${esc(item.amount)}</span>` : ''}
    <button class="x" data-act="shopDel" data-id="${item.id}">✕</button></div>`;
}

function listView() {
  const open = state.shopping.filter(i => !i.checked);
  const done = state.shopping.filter(i => i.checked);
  let html = `<header class="top"><h1>${t('shopHeader', state.lang)}</h1></header>
    <form class="search" data-form="shopAdd"><span>＋</span>
      <input id="n" type="text" placeholder="${t('shopPlaceholder', state.lang)}" autocomplete="off">
    </form>`;
  if (!state.shopping.length) {
    html += `<p class="muted card pad">${t('emptyList', state.lang)}</p>`;
  }
  if (open.length) html += `<section><h3>${t('buyList', state.lang)} (${open.length})</h3><div class="card">${open.map(shopRow).join('')}</div></section>`;
  if (done.length) html += `<section><h3>${t('boughtList', state.lang)} (${done.length})</h3><div class="card">${done.map(shopRow).join('')}</div></section>`;
  if (state.shopping.length) {
    html += `<div class="actions">
      <button class="primary wide" data-act="shopMove" ${done.length ? '' : 'disabled'}>${t('moveToPantry', state.lang)}</button>
      <button class="secondary wide" data-act="shopShare" ${open.length ? '' : 'disabled'}>${t('shareList', state.lang)}</button>
      <button class="secondary wide" data-act="shopClearChecked" ${done.length ? '' : 'disabled'}>${t('clearChecked', state.lang)}</button>
      <button class="danger wide" data-act="shopClearAll">${t('clearAll', state.lang)}</button></div>`;
  }
  return html;
}

function renderTabbar() {
  const unchecked = state.shopping.filter(i => !i.checked).length;
  const tabs = [
    ['home', '🧊', state.lang === 'en' ? 'Pantry' : 'Otthon'], 
    ['results', '🍳', state.lang === 'en' ? 'Cook' : 'Főzzünk'], 
    ['ideas', '💡', state.lang === 'en' ? 'Ideas' : 'Ötletek'], 
    ['list', '🛒', state.lang === 'en' ? 'List' : 'Lista']
  ];
  $tabbar.innerHTML = tabs.map(([id, icon, label]) =>
    `<button class="${ui.tab === id ? 'active' : ''}" data-act="tab" data-v="${id}">
      <span class="ti">${icon}${id === 'list' && unchecked ? `<i class="dot">${unchecked}</i>` : ''}</span><span>${label}</span></button>`).join('');
  $tabbar.style.display = (ui.recipeId || ui.tab === 'settings') ? 'none' : '';
}

async function render() {
  await checkAndRefreshDailyRecipes(state);

  if (ui.recipeId) $view.innerHTML = detailView();
  else if (ui.tab === 'settings') $view.innerHTML = settingsView();
  else $view.innerHTML = { home: homeView, results: resultsView, ideas: ideasView, list: listView }[ui.tab]();
  document.body.classList.toggle('has-tabbar', !ui.recipeId && ui.tab !== 'settings');
  renderTabbar();
}

function openRecipe(id) {
  ui.scroll = window.scrollY;
  ui.recipeId = id;
  const r = findRecipeAnywhere(id);
  ui.servings = state.household > 0 ? state.household : (r ? r.servings : 2);
  history.pushState({ recipe: id }, '');
  render();
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', () => {
  if (ui.recipeId) {
    ui.recipeId = null;
    render();
    window.scrollTo(0, ui.scroll);
  }
});

function setTab(tab) {
  ui.tab = tab;
  render();
  window.scrollTo(0, 0);
}

const actions = {
  tab: d => setTab(d.v),
  goHome: () => setTab('home'),
  goResults: () => setTab('results'),
  toggle: d => { togglePantry(state, d.id); persist(); render(); },
  addSugg: d => { state.pantry.indexOf(d.id) < 0 && state.pantry.push(d.id); ui.query = ''; persist(); render(); },
  commitTyped: () => commitTyped(),
  removeCustom: d => { state.custom = state.custom.filter(c => c !== d.id); persist(); render(); },
  clearPantry: () => {
    if (confirm(state.lang === 'en' ? 'Clear all selected pantry items?' : 'Törlöd az összes kiválasztott alapanyagot?')) { state.pantry = []; state.custom = []; persist(); render(); }
  },
  tier: d => { ui.tier = d.v || null; render(); },
  sort: d => { ui.sortBy = d.v; render(); },
  ideaSort: d => { ui.ideaSort = d.v; render(); },
  open: d => openRecipe(d.id),
  back: () => history.back(),
  fav: d => {
    const i = state.favorites.indexOf(d.id);
    if (i >= 0) state.favorites.splice(i, 1); else state.favorites.push(d.id);
    persist(); render();
  },
  favOnly: () => { ui.favOnly = !ui.favOnly; render(); },
  random: () => { const r = randomRecipe(ui.tier); if (r) openRecipe(r.id); },
  srv: d => {
    ui.servings = Math.min(12, Math.max(1, ui.servings + Number(d.d)));
    state.household = ui.servings;
    persist(); render();
  },
  shopToggle: d => {
    const it = state.shopping.find(i => i.id === d.id);
    if (it) { it.checked = !it.checked; persist(); render(); }
  },
  shopDel: d => { state.shopping = state.shopping.filter(i => i.id !== d.id); persist(); render(); },
  shopMove: () => { moveCheckedToPantry(state); persist(); render(); toast(state.lang === 'en' ? 'Moved to pantry' : 'Átrakva az otthoni készletbe'); },
  shopShare: () => shareText(shoppingText(state.shopping.filter(i => !i.checked), 'Shopping list:')),
  shopClearChecked: () => { state.shopping = state.shopping.filter(i => !i.checked); persist(); render(); },
  shopClearAll: () => {
    if (confirm(state.lang === 'en' ? 'Clear shopping list?' : 'Törlöd a teljes bevásárlólistát?')) { state.shopping = []; persist(); render(); }
  },
  setLang: async d => {
    state.lang = d.v;
    state.lastDailyDate = ''; 
    persist();
    await render();
    toast(state.lang === 'en' ? 'Language switched to English' : 'Nyelv átállítva magyarra');
  },
  generateCustomAI: async () => {
    ui.customAiLoading = true;
    render();
    try {
      const customRecipe = await fetchCustomAIRecipe(state);
      state.aiRecipes = [customRecipe].concat(state.aiRecipes || []);
      persist();
      openRecipe(customRecipe.id);
      toast(state.lang === 'en' ? 'Recipe generated successfully! ✨' : 'Recept sikeresen kitalálva! ✨');
    } catch (e) {
      alert(e.message);
    } finally {
      ui.customAiLoading = false;
      render();
    }
  }
};

function commitTyped() {
  if (!ui.query || !ui.query.trim()) return;
  addTyped(state, ui.query);
  ui.query = '';
  persist();
  render();
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = actions[el.dataset.act];
  if (fn) fn(el.dataset);
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const kind = e.target.dataset.form;
  if (kind === 'pantryAdd') commitTyped();
  if (kind === 'shopAdd') {
    const input = document.getElementById('n');
    if (input && input.value.trim()) {
      addManualShopping(state, input.value);
      persist();
      render();
    }
  }
  if (kind === 'saveApiKey') {
    const input = document.getElementById('apikeyInput');
    if (input) {
      state.apiKey = input.value.trim();
      state.lastDailyDate = ''; 
      persist();
      toast(t('keySavedToast', state.lang));
    }
  }
  if (kind === 'noop') document.activeElement && document.activeElement.blur();
});

document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    ui.query = e.target.value;
    const suggEl = document.getElementById('sugg');
    if (suggEl) suggEl.innerHTML = suggHTML();
  } else if (e.target.id === 's') {
    ui.search = e.target.value;
    const ideaListEl = document.getElementById('ideaList');
    if (ideaListEl) ideaListEl.innerHTML = ideaListHTML();
  }
});

render();
