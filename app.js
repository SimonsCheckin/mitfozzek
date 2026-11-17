'use strict';
// Felület: nézetek kirajzolása és eseménykezelés. A logika a logic.js-ben van.

const state = loadState(localStorage);
const ui = {
  tab: 'home',        // home | results | ideas | list
  tier: null,         // null | cheap | medium | expensive
  query: '',          // otthon fül keresője
  search: '',         // ötletek keresője
  favOnly: false,
  showMore: false,
  recipeId: null,     // ha nem null, a receptoldal látszik
  servings: 0,
  scroll: 0
};

const $view = document.getElementById('view');
const $tabbar = document.getElementById('tabbar');
const $toast = document.getElementById('toast');

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function persist() { saveState(localStorage, state); }

let toastTimer = null;
function toast(msg) {
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
  try { await navigator.clipboard.writeText(text); toast('Vágólapra másolva'); }
  catch (e) { window.prompt('Másold ki a listát:', text); }
}

// ---------- Közös elemek ----------

function chip(id, emoji, title, on, act, extra) {
  return `<button class="chip ${on ? 'on' : ''}" data-act="${act}" data-id="${esc(id)}">${emoji} ${esc(title)}${on ? (extra || ' ✓') : ''}</button>`;
}

function tierBadge(tier) {
  const t = TIERS[tier];
  return `<span class="badge" style="--c:${t.color}">${t.dots} ${t.title}</span>`;
}

function segmented() {
  const opts = [[null, 'Mind']].concat(TIER_ORDER.map(k => [k, TIERS[k].title]));
  const hint = ui.tier ? TIERS[ui.tier].hint : 'Minden árkategória';
  return `<div class="seg">${opts.map(([k, label]) =>
    `<button class="${ui.tier === k ? 'active' : ''}" data-act="tier" data-v="${k || ''}">${label}</button>`).join('')}</div>
    <p class="hint">${hint}</p>`;
}

function emptyState(emoji, title, msg, btnLabel, act) {
  return `<div class="empty"><div class="big">${emoji}</div><h2>${title}</h2><p>${msg}</p>
    <button class="primary" data-act="${act}">${btnLabel}</button></div>`;
}

// ---------- Otthon fül ----------

function suggHTML() {
  if (!ui.query.trim()) return '';
  const list = suggestions(ui.query);
  let html = '';
  if (!list.length) html += '<p class="muted">Nincs ilyen a listában.</p>';
  else html += `<div class="chips">${list.map(i => chip(i.id, i.emoji, i.name, state.pantry.indexOf(i.id) >= 0, 'addSugg')).join('')}</div>`;
  if (!exactMatchExists(ui.query)) {
    html += `<button class="secondary" data-act="commitTyped">＋ Hozzáadás saját alapanyagként: ${esc(ui.query.trim())}</button>`;
  }
  return html;
}

function homeView() {
  const selected = ING.filter(i => state.pantry.indexOf(i.id) >= 0);
  const count = pantryCount(state);
  let html = `<header class="top"><h1>Mi van otthon?</h1>
    <button class="link" data-act="clearPantry" ${count ? '' : 'disabled'}>Törlés</button></header>
    <form class="search" data-form="pantryAdd">
      <span>🔍</span>
      <input id="q" type="search" placeholder="Írd be, mi van otthon (pl. tojás)" autocomplete="off"
             autocapitalize="none" enterkeyhint="done" value="${esc(ui.query)}">
    </form>
    <div id="sugg">${suggHTML()}</div>`;

  if (count) {
    html += `<section><h3>✅ Nálam van (${count})</h3><div class="chips">
      ${selected.map(i => chip(i.id, i.emoji, i.name, true, 'toggle', ' ✕')).join('')}
      ${state.custom.map(c => chip(c, '✏️', c, true, 'removeCustom', ' ✕')).join('')}
    </div></section>`;
  }

  for (const cat of CATEGORIES) {
    const items = ING.filter(i => i.cat === cat.id && !i.staple);
    html += `<section><h3>${cat.emoji} ${cat.title}</h3><div class="chips">
      ${items.map(i => chip(i.id, i.emoji, i.name, state.pantry.indexOf(i.id) >= 0, 'toggle')).join('')}
    </div></section>`;
  }
  html += `<p class="muted small">A só, bors, olaj, cukor és víz mindig megvan otthon, ezeket nem kell kiválasztanod.</p>
    <div class="cta"><button class="primary wide" data-act="goResults" ${count ? '' : 'disabled'}>
      🍳 ${count ? `Mit főzhetek ezekből? (${count})` : 'Válassz alapanyagokat'}</button></div>`;
  return html;
}

// ---------- Főzzünk fül ----------

function matchRow(m) {
  const r = m.recipe;
  const missText = m.missing.map(x => ING_BY_ID[x.id].name.toLowerCase()).join(', ');
  return `<button class="row" data-act="open" data-id="${r.id}">
    <span class="emoji">${r.emoji}</span>
    <span class="grow"><strong>${esc(r.name)}</strong>
      <span class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes} perc</span></span>
      ${m.missing.length ? `<span class="warn">Hiányzik: ${esc(missText)}</span>` : '<span class="ok">Minden megvan hozzá ✅</span>'}
    </span><span class="chev">›</span></button>`;
}

function recipeSection(title, items) {
  if (!items.length) return '';
  return `<section><h3>${title}</h3><div class="card">${items.map(matchRow).join('')}</div></section>`;
}

function resultsView() {
  let html = `<header class="top"><h1>Mit főzzek?</h1></header>`;
  if (pantryCount(state) === 0) {
    return html + emptyState('🧺', 'Még nem adtál meg alapanyagot',
      'Add meg, mi van otthon, és összerakok belőle egy ételt. Addig is nézz körül az Ötletek fülön!',
      'Alapanyagok megadása', 'goHome');
  }
  const all = matches(state, ui.tier);
  const ready = all.filter(m => m.missing.length === 0);
  const almost = all.filter(m => m.missing.length === 1 || m.missing.length === 2);
  const more = all.filter(m => m.missing.length === 3 || m.missing.length === 4);
  const tips = unlockSuggestions(state, ui.tier, 3);

  html += segmented();
  if (!ready.length && !almost.length) {
    html += `<p class="muted card pad">Ezekből még nem sikerült egy teljes ételt összerakni. Adj hozzá pár alapanyagot, vagy nézz körül az Ötletek fülön!</p>`;
  }
  html += recipeSection('✅ Máris főzhetsz', ready);
  html += recipeSection('🛒 Majdnem kész: 1–2 dolog hiányzik', almost);
  if (tips.length) {
    html += `<section><h3>💡 Okos bevásárlás</h3><div class="card">${tips.map(t => `
      <div class="row static"><span class="emoji">${t.ingredient.emoji}</span>
        <span class="grow"><strong>Vegyél: ${esc(t.ingredient.name)}</strong>
        <span class="muted small">${t.names.length} új étel készülhet belőle: ${esc(t.names.slice(0, 3).join(', '))}</span></span></div>`).join('')}
    </div></section>`;
  }
  if (more.length) {
    html += ui.showMore ? recipeSection('Több vásárlással', more)
      : `<button class="secondary wide" data-act="showMore">Több ötlet mutatása (${more.length})</button>`;
  }
  return html;
}

// ---------- Ötletek fül ----------

function ideaListHTML() {
  const list = ideas(state, ui.tier, ui.search, ui.favOnly);
  if (!list.length) return `<p class="muted card pad">${ui.favOnly ? 'Még nincs kedvenc recepted.' : 'Nincs találat.'}</p>`;
  return TIER_ORDER.map(tier => {
    const items = list.filter(r => r.tier === tier);
    if (!items.length) return '';
    return `<section><h3>${TIERS[tier].title} · ${TIERS[tier].hint}</h3><div class="card">${items.map(r => `
      <button class="row" data-act="open" data-id="${r.id}">
        <span class="emoji">${r.emoji}</span>
        <span class="grow"><strong>${esc(r.name)}</strong>
          <span class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes} perc</span></span></span>
        ${state.favorites.indexOf(r.id) >= 0 ? '<span class="pink">♥</span>' : ''}<span class="chev">›</span>
      </button>`).join('')}</div></section>`;
  }).join('');
}

function ideasView() {
  return `<header class="top"><h1>Ötletek</h1>
      <span><button class="link" data-act="favOnly">${ui.favOnly ? '♥ Kedvencek' : '♡ Kedvencek'}</button>
      <button class="link" data-act="random">🎲 Meglepj!</button></span></header>
    ${segmented()}
    <form class="search" data-form="noop"><span>🔍</span>
      <input id="s" type="search" placeholder="Étel vagy alapanyag keresése" autocomplete="off" enterkeyhint="search" value="${esc(ui.search)}">
    </form>
    <div id="ideaList">${ideaListHTML()}</div>`;
}

// ---------- Receptoldal ----------

function detailView() {
  const r = RECIPE_BY_ID[ui.recipeId];
  const factor = ui.servings / Math.max(r.servings, 1);
  const missing = missingRequired(state, r);
  const listed = state.shopping.some(e => !e.checked && e.sources.indexOf(r.name) >= 0);
  const fav = state.favorites.indexOf(r.id) >= 0;

  const rows = r.ing.map(x => {
    const ing = ING_BY_ID[x.id];
    const have = has(state, x.id);
    const icon = have ? '<span class="ok">✔</span>' : x.opt ? '<span class="muted">◌</span>' : '<span class="warn">🛒</span>';
    return `<div class="ingrow">${icon}
      <span class="grow">${ing.emoji} ${esc(ing.name)}${x.opt ? '<span class="muted small block">elhagyható / bónusz</span>' : ''}</span>
      <span class="muted amount">${esc(AM.scale(x.amount, factor))}</span></div>`;
  }).join('');

  return `<div class="detailbar"><button class="link" data-act="back">‹ Vissza</button>
      <strong class="ellipsis">${esc(r.name)}</strong>
      <button class="heart ${fav ? 'on' : ''}" data-act="fav" data-id="${r.id}">${fav ? '♥' : '♡'}</button></div>
    <div class="detail">
      <div class="hero">${r.emoji}</div>
      <h1>${esc(r.name)}</h1>
      <p class="meta">${tierBadge(r.tier)} <span class="muted">⏱ ${r.minutes} perc</span></p>

      <h2>Hozzávalók</h2>
      <div class="stepper"><span>👥 <strong>${ui.servings} adag</strong></span>
        <span><button data-act="srv" data-d="-1" ${ui.servings <= 1 ? 'disabled' : ''}>−</button>
        <button data-act="srv" data-d="1" ${ui.servings >= 12 ? 'disabled' : ''}>+</button></span></div>
      ${ui.servings !== r.servings ? `<p class="muted small">Az eredeti recept ${r.servings} adagos, a mennyiségek átszámolva.</p>` : ''}
      <div class="ings">${rows}</div>
      ${missing.length === 0
        ? '<p class="ok">✅ Minden hozzávaló megvan otthon!</p>'
        : `<button class="primary wide" data-act="addMissing" ${listed ? 'disabled' : ''}>
             ${listed ? '✔ Hozzáadva a bevásárlólistához' : `🛒 Hiányzók a bevásárlólistára (${missing.length})`}</button>
           <button class="secondary wide" data-act="shareMissing">⇪ Hiányzók megosztása</button>`}

      <h2>Elkészítés</h2>
      ${ui.servings !== r.servings ? '<p class="muted small">A lépésekben szereplő mennyiségek (pl. víz) az eredeti adagszámra vonatkoznak.</p>' : ''}
      <ol class="steps">${r.steps.map(s => `<li><span class="num"></span><span>${esc(s)}</span></li>`).join('')}</ol>
    </div>`;
}

// ---------- Lista fül ----------

function shopRow(item) {
  const ing = item.ingredientID ? ING_BY_ID[item.ingredientID] : null;
  return `<div class="row static ${item.checked ? 'done' : ''}">
    <button class="check" data-act="shopToggle" data-id="${item.id}">${item.checked ? '✅' : '⚪️'}</button>
    <span class="grow" data-act="shopToggle" data-id="${item.id}"><span class="name">${ing ? ing.emoji + ' ' : ''}${esc(item.name)}</span>
      ${item.sources.length ? `<span class="muted small block">${esc(item.sources.join(', '))}</span>` : ''}</span>
    ${item.amount ? `<span class="muted amount">${esc(item.amount)}</span>` : ''}
    <button class="x" data-act="shopDel" data-id="${item.id}" aria-label="Törlés">✕</button></div>`;
}

function listView() {
  const open = state.shopping.filter(i => !i.checked);
  const done = state.shopping.filter(i => i.checked);
  let html = `<header class="top"><h1>Bevásárlólista</h1></header>
    <form class="search" data-form="shopAdd"><span>＋</span>
      <input id="n" type="text" placeholder="Új tétel (pl. tej)" autocomplete="off" enterkeyhint="done">
    </form>`;
  if (!state.shopping.length) {
    html += `<p class="muted card pad">Üres a lista. A receptoldalon a „Hiányzók a bevásárlólistára” gombbal egy koppintással ide teheted, amit venned kell, vagy írj be egy tételt fent.</p>`;
  }
  if (open.length) html += `<section><h3>Megvenni (${open.length})</h3><div class="card">${open.map(shopRow).join('')}</div></section>`;
  if (done.length) html += `<section><h3>Megvettem (${done.length})</h3><div class="card">${done.map(shopRow).join('')}</div></section>`;
  if (state.shopping.length) {
    html += `<div class="actions">
      <button class="primary wide" data-act="shopMove" ${done.length ? '' : 'disabled'}>🧊 Megvettek átrakása az otthoni készletbe</button>
      <button class="secondary wide" data-act="shopShare" ${open.length ? '' : 'disabled'}>⇪ Lista megosztása</button>
      <button class="secondary wide" data-act="shopClearChecked" ${done.length ? '' : 'disabled'}>Kipipáltak törlése</button>
      <button class="danger wide" data-act="shopClearAll">Teljes lista törlése</button></div>`;
  }
  return html;
}

// ---------- Kirajzolás ----------

function renderTabbar() {
  const unchecked = state.shopping.filter(i => !i.checked).length;
  const tabs = [['home', '🧊', 'Otthon'], ['results', '🍳', 'Főzzünk'], ['ideas', '💡', 'Ötletek'], ['list', '🛒', 'Lista']];
  $tabbar.innerHTML = tabs.map(([id, icon, label]) =>
    `<button class="${ui.tab === id ? 'active' : ''}" data-act="tab" data-v="${id}">
      <span class="ti">${icon}${id === 'list' && unchecked ? `<i class="dot">${unchecked}</i>` : ''}</span><span>${label}</span></button>`).join('');
  $tabbar.style.display = ui.recipeId ? 'none' : '';
}

function render() {
  if (ui.recipeId) $view.innerHTML = detailView();
  else $view.innerHTML = { home: homeView, results: resultsView, ideas: ideasView, list: listView }[ui.tab]();
  document.body.classList.toggle('has-tabbar', !ui.recipeId);
  renderTabbar();
}

// ---------- Navigáció ----------

function openRecipe(id) {
  ui.scroll = window.scrollY;
  ui.recipeId = id;
  ui.servings = state.household > 0 ? state.household : RECIPE_BY_ID[id].servings;
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

// ---------- Események ----------

const actions = {
  tab: d => setTab(d.v),
  goHome: () => setTab('home'),
  goResults: () => { ui.showMore = false; setTab('results'); },
  toggle: d => { togglePantry(state, d.id); persist(); render(); },
  addSugg: d => { state.pantry.indexOf(d.id) < 0 && state.pantry.push(d.id); ui.query = ''; persist(); render(); },
  commitTyped: () => commitTyped(),
  removeCustom: d => { state.custom = state.custom.filter(c => c !== d.id); persist(); render(); },
  clearPantry: () => {
    if (confirm('Törlöd az összes kiválasztott alapanyagot?')) { state.pantry = []; state.custom = []; persist(); render(); }
  },
  tier: d => { ui.tier = d.v || null; ui.showMore = false; render(); },
  showMore: () => { ui.showMore = true; render(); },
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
  addMissing: () => {
    addMissing(state, RECIPE_BY_ID[ui.recipeId], ui.servings);
    persist(); render(); toast('Hozzáadva a bevásárlólistához');
  },
  shareMissing: () => {
    const r = RECIPE_BY_ID[ui.recipeId];
    const factor = ui.servings / Math.max(r.servings, 1);
    const items = missingRequired(state, r).map(x => ({ name: ING_BY_ID[x.id].name, amount: AM.scale(x.amount, factor) }));
    shareText(shoppingText(items, `Bevásárlólista (${r.name}, ${ui.servings} adag):`));
  },
  shopToggle: d => {
    const it = state.shopping.find(i => i.id === d.id);
    if (it) { it.checked = !it.checked; persist(); render(); }
  },
  shopDel: d => { state.shopping = state.shopping.filter(i => i.id !== d.id); persist(); render(); },
  shopMove: () => { moveCheckedToPantry(state); persist(); render(); toast('Átrakva az otthoni készletbe'); },
  shopShare: () => shareText(shoppingText(state.shopping.filter(i => !i.checked), 'Bevásárlólista:')),
  shopClearChecked: () => { state.shopping = state.shopping.filter(i => !i.checked); persist(); render(); },
  shopClearAll: () => {
    if (confirm('Törlöd a teljes bevásárlólistát?')) { state.shopping = []; persist(); render(); }
  }
};

function commitTyped() {
  if (!ui.query.trim()) return;
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
  if (kind === 'noop') document.activeElement && document.activeElement.blur();
});

// Gépelés közben csak a javaslatok / találatok frissülnek, hogy a billentyűzet ne záródjon be.
document.addEventListener('input', e => {
  if (e.target.id === 'q') {
    ui.query = e.target.value;
    document.getElementById('sugg').innerHTML = suggHTML();
  } else if (e.target.id === 's') {
    ui.search = e.target.value;
    document.getElementById('ideaList').innerHTML = ideaListHTML();
  }
});

render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
