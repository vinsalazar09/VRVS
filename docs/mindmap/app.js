(() => {
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const viewport = document.getElementById('viewport');
const world = document.getElementById('world');
const svg = document.getElementById('connections');

const titleEl = document.getElementById('title');
const btnBack = document.getElementById('btnBack');
const btnFit = document.getElementById('btnFit');
const btn1x = document.getElementById('btn1x');
const btnSearch = document.getElementById('btnSearch');

const scrim = document.getElementById('scrim');
const sheet = document.getElementById('sheet');
const sheetTitle = document.getElementById('sheetTitle');
const sheetBody = document.getElementById('sheetBody');
const btnCloseSheet = document.getElementById('btnCloseSheet');

const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const searchList = document.getElementById('searchList');
const btnCloseSearch = document.getElementById('btnCloseSearch');

const state = {
  rootId: null,
  nodesById: new Map(),
  order: [],
  expanded: new Set(),
  selectedId: null,
  tx: 24,
  ty: 88,
  s: 1,
  pointers: new Map(),
  panStart: null,
  pinchStart: null,
};

const layoutCfg = {
  padX: 72,
  padY: 96,
  levelX: 320,
  gapY: 26,
  minS: 0.3,
  maxS: 3.0,
};

// Voltar para VRVS
btnBack.addEventListener('click', () => {
  const params = new URLSearchParams(location.search);
  const from = params.get('from');
  if (from === 'vrvs') {
    window.location.href = '../index.html#mindmaps';
  } else {
    window.location.href = '../index.html';
  }
});

// Obter ID do mapa via query param
function getMapId() {
  const params = new URLSearchParams(location.search);
  return params.get('id');
}

// Parser VRVS Outline v1 (embutido no viewer)
function parseOutlineToMap(text) {
  const lines = text.split('\n');
  const stack = [];
  const root = { id: 'root', label: 'Root', children: [], details: [] };
  let lastNode = root;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    let indent = 0;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === ' ') indent++;
      else if (line[j] === '\t') indent += 2;
      else break;
    }
    const level = Math.floor(indent / 2);
    
    if (trimmed.startsWith('- ')) {
      const label = trimmed.substring(2).trim();
      if (!label) continue;
      
      const node = {
        id: `node_${i}_${Date.now()}_${Math.random()}`,
        label: label,
        children: [],
        details: []
      };
      
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      const parent = stack.length > 0 ? stack[stack.length - 1].node : root;
      parent.children.push(node);
      
      stack.push({ node, level });
      lastNode = node;
    } else if (trimmed.startsWith('* ')) {
      const detail = trimmed.substring(2).trim();
      if (detail && lastNode) {
        lastNode.details.push(detail);
      }
    }
  }
  
  return root.children.length > 0 ? root.children[0] : null;
}

// Mostrar tela de fallback amigável
function showFallbackScreen(message) {
  document.getElementById('topbar').style.display = 'none';
  document.getElementById('viewport').style.display = 'none';
  
  const fallback = document.createElement('div');
  fallback.id = 'fallbackScreen';
  fallback.style.cssText = `
    position: fixed;
    inset: 0;
    background: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 2000;
  `;
  
  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.cssText = `
    color: rgba(255,255,255,0.9);
    font-size: 16px;
    margin-bottom: 24px;
    text-align: center;
  `;
  
  const btn = document.createElement('button');
  btn.textContent = 'Voltar para 🧠 Mapas';
  btn.className = 'btn';
  btn.style.cssText = `
    padding: 14px 24px;
    font-size: 15px;
    font-weight: 600;
    background: rgba(0,206,209,0.8);
    color: #000;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    touch-action: manipulation;
    min-height: 44px;
  `;
  btn.addEventListener('click', () => {
    window.location.href = '../index.html#mindmaps';
  });
  
  fallback.appendChild(msg);
  fallback.appendChild(btn);
  document.body.appendChild(fallback);
}

// Carregar mapa do localStorage
function loadMap() {
  const mapId = getMapId();
  if (!mapId) {
    showFallbackScreen('Nenhum mapa selecionado.');
    return;
  }

  try {
    const raw = localStorage.getItem('vrvs_mindmaps');
    if (!raw) {
      showFallbackScreen('Mapa não encontrado.');
      return;
    }
    
    const data = JSON.parse(raw);
    const items = data.version ? data.items : data;
    const item = items.find(m => m.id === mapId);
    
    if (!item) {
      showFallbackScreen('Mapa não encontrado.');
      return;
    }
    
    titleEl.textContent = item.title || 'Mapa Mental';
    
    // Gerar map em memória a partir de outlineText (se não tiver map legado)
    let mapToRender = null;
    if (item.map) {
      // Legado: usar map existente
      mapToRender = item.map;
    } else if (item.outlineText) {
      // Outline-only: gerar map a partir do outline
      mapToRender = parseOutlineToMap(item.outlineText);
      if (!mapToRender) {
        showFallbackScreen('Erro ao processar outline do mapa.');
        return;
      }
    } else {
      showFallbackScreen('Mapa sem conteúdo válido.');
      return;
    }
    
    state.rootId = mapToRender.id || 'root';

    state.nodesById.clear();
    state.order.length = 0;

    const walk = (node, parentId = null, depth = 0) => {
      const n = {
        id: node.id || `node_${depth}_${Date.now()}_${Math.random()}`,
        label: node.label || '',
        details: node.details || null,
        parentId,
        depth,
        children: [],
        el: null,
        w: 200,
        h: 44,
        x: 0,
        y: 0,
        subtreeH: 0,
      };
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(c => {
          const childId = c.id || `child_${Date.now()}_${Math.random()}`;
          n.children.push(childId);
          walk(c, n.id, depth + 1);
        });
      }
      state.nodesById.set(n.id, n);
      state.order.push(n.id);
    };
    walk(mapToRender);

    if (!state.rootId || !state.nodesById.has(state.rootId)) {
      state.rootId = state.order[0];
    }

    state.expanded = new Set([state.rootId]);
    state.selectedId = state.rootId;

    buildNodeDOM();
    measureNodes();
    relayout({ fitAfter: true });
  } catch(e) {
    console.error('[MINDMAP] Erro ao carregar:', e);
    showFallbackScreen('Erro ao carregar mapa.');
  }
}

function buildNodeDOM() {
  world.querySelectorAll('.node').forEach(el => el.remove());

  state.order.forEach(id => {
    const n = state.nodesById.get(id);
    if (!n) return;
    const el = document.createElement('div');
    el.className = `node level-${Math.min(n.depth, 4)}`;
    el.dataset.id = n.id;

    const row = document.createElement('div');
    row.className = 'row';

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = n.label;

    const toggler = document.createElement('button');
    toggler.className = 'toggler';
    toggler.type = 'button';
    toggler.setAttribute('aria-label', 'Expandir/colapsar');

    row.appendChild(label);
    row.appendChild(toggler);
    el.appendChild(row);

    el.addEventListener('click', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('toggler')) return;
      selectNode(n.id, { openSheet: true, center: true });
    });

    toggler.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNode(n.id);
    });

    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') e.preventDefault();
    }, { passive: false });

    world.appendChild(el);
    n.el = el;
  });

  updateNodeClasses();
}

function updateNodeClasses() {
  state.order.forEach(id => {
    const n = state.nodesById.get(id);
    if (!n.el) return;
    const hasKids = n.children.length > 0;
    n.el.classList.toggle('leaf', !hasKids);
    const isExpanded = state.expanded.has(id);
    n.el.classList.toggle('expanded', hasKids && isExpanded);
    n.el.classList.toggle('collapsed', hasKids && !isExpanded);
    n.el.classList.toggle('selected', id === state.selectedId);
    const btn = n.el.querySelector('.toggler');
    if (btn) btn.disabled = !hasKids;
  });
}

function measureNodes() {
  state.order.forEach(id => {
    const n = state.nodesById.get(id);
    if (!n.el) return;
    n.w = n.el.offsetWidth || n.w;
    n.h = n.el.offsetHeight || n.h;
  });
}

function isVisible(id) {
  if (id === state.rootId) return true;
  const n = state.nodesById.get(id);
  if (!n) return false;
  let p = n.parentId;
  while (p) {
    if (!state.expanded.has(p)) return false;
    p = state.nodesById.get(p)?.parentId || null;
  }
  return true;
}

function computeSubtreeH(id) {
  const n = state.nodesById.get(id);
  if (!n) return 0;
  const kids = (state.expanded.has(id) ? n.children : []).filter(isVisible);
  if (kids.length === 0) { n.subtreeH = n.h; return n.subtreeH; }
  let sum = 0;
  kids.forEach((cid, idx) => {
    const ch = computeSubtreeH(cid);
    sum += ch;
    if (idx < kids.length - 1) sum += layoutCfg.gapY;
  });
  n.subtreeH = Math.max(n.h, sum);
  return n.subtreeH;
}

function assignPositions(id, topY) {
  const n = state.nodesById.get(id);
  const x = layoutCfg.padX + (n.depth * layoutCfg.levelX);
  const y = topY + (n.subtreeH - n.h) / 2;
  n.x = x; n.y = y;

  const kids = (state.expanded.has(id) ? n.children : []).filter(isVisible);
  if (kids.length === 0) return;

  let childTop = topY;
  kids.forEach((cid, idx) => {
    const c = state.nodesById.get(cid);
    assignPositions(cid, childTop);
    childTop += c.subtreeH + (idx < kids.length - 1 ? layoutCfg.gapY : 0);
  });
}

function computeBoundsVisible() {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  state.order.forEach(id => {
    if (!isVisible(id)) return;
    const n = state.nodesById.get(id);
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.w);
    maxY = Math.max(maxY, n.y + n.h);
  });
  if (!isFinite(minX)) return { minX:0, minY:0, maxX:0, maxY:0, w:0, h:0 };
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function applyPositions() {
  state.order.forEach(id => {
    const n = state.nodesById.get(id);
    if (!n.el) return;
    const vis = isVisible(id);
    n.el.classList.toggle('is-hidden', !vis);
    n.el.style.transform = `translate3d(${Math.round(n.x)}px, ${Math.round(n.y)}px, 0)`;
  });

  const b = computeBoundsVisible();
  const pad = 140;
  const W = Math.max(800, Math.ceil(b.maxX + pad));
  const H = Math.max(800, Math.ceil(b.maxY + pad));
  world.style.width = W + 'px';
  world.style.height = H + 'px';
  svg.setAttribute('width', String(W));
  svg.setAttribute('height', String(H));
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
}

function drawConnections() {
  svg.innerHTML = '';
  const frag = document.createDocumentFragment();
  state.order.forEach(id => {
    const p = state.nodesById.get(id);
    if (!p || !isVisible(id) || !state.expanded.has(id)) return;
    p.children.forEach(cid => {
      if (!isVisible(cid)) return;
      const c = state.nodesById.get(cid);
      const x1 = p.x + p.w, y1 = p.y + p.h/2;
      const x2 = c.x, y2 = c.y + c.h/2;
      const dx = Math.max(80, (x2 - x1) * 0.6);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`);
      frag.appendChild(path);
    });
  });
  svg.appendChild(frag);
}

function applyWorldTransform() {
  world.style.transform = `translate3d(${state.tx}px, ${state.ty}px, 0) scale(${state.s})`;
}

function fitToScreen() {
  const b = computeBoundsVisible();
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const margin = 40;
  const scaleX = (vw - margin*2) / Math.max(1, b.w);
  const scaleY = (vh - margin*2) / Math.max(1, b.h);
  const s = clamp(Math.min(scaleX, scaleY, 1.35), layoutCfg.minS, layoutCfg.maxS);

  const cx = b.minX + b.w/2;
  const cy = b.minY + b.h/2;

  state.s = s;
  state.tx = Math.round(vw/2 - cx*s);
  state.ty = Math.round(vh/2 - cy*s);
  applyWorldTransform();
}

function zoom1x() {
  state.s = 1;
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const b = computeBoundsVisible();
  const cx = b.minX + b.w/2;
  const cy = b.minY + b.h/2;
  state.tx = Math.round(vw/2 - cx);
  state.ty = Math.round(vh/2 - cy);
  applyWorldTransform();
}

function centerOnNode(id) {
  const n = state.nodesById.get(id);
  if (!n || !isVisible(id)) return;
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const wx = n.x + n.w/2, wy = n.y + n.h/2;
  state.tx = Math.round(vw/2 - wx*state.s);
  state.ty = Math.round(vh/2 - wy*state.s);
  applyWorldTransform();
}

function anchorNodeDuringRelayout(id, before) {
  const n = state.nodesById.get(id);
  if (!n) return;
  const wx = n.x + n.w/2, wy = n.y + n.h/2;
  const sxNow = state.tx + wx * state.s;
  const syNow = state.ty + wy * state.s;
  state.tx += (before.sx - sxNow);
  state.ty += (before.sy - syNow);
  applyWorldTransform();
}

function relayout({ fitAfter = false } = {}) {
  measureNodes();
  computeSubtreeH(state.rootId);
  assignPositions(state.rootId, layoutCfg.padY);
  applyPositions();
  drawConnections();
  updateNodeClasses();
  applyWorldTransform();
  if (fitAfter) fitToScreen();
}

let lastTapTime = 0;
let lastTapId = null;

viewport.addEventListener('dblclick', (e) => {
  const now = Date.now();
  if (now - lastTapTime < 300 && lastTapId === null) {
    if (Math.abs(state.s - 1) < 0.1) {
      fitToScreen();
    } else {
      zoom1x();
    }
    lastTapTime = 0;
    lastTapId = null;
  } else {
    lastTapTime = now;
    lastTapId = null;
  }
});

function expandAncestors(id) {
  let p = state.nodesById.get(id)?.parentId || null;
  while (p) { state.expanded.add(p); p = state.nodesById.get(p)?.parentId || null; }
}

function toggleNode(id) {
  const n = state.nodesById.get(id);
  if (!n || n.children.length === 0) return;

  const anchorId = state.selectedId || id;
  const a = state.nodesById.get(anchorId);
  const before = a ? { sx: state.tx + (a.x + a.w/2)*state.s, sy: state.ty + (a.y + a.h/2)*state.s } : null;

  if (state.expanded.has(id)) state.expanded.delete(id);
  else state.expanded.add(id);

  expandAncestors(id);

  measureNodes();
  computeSubtreeH(state.rootId);
  assignPositions(state.rootId, layoutCfg.padY);
  applyPositions();
  drawConnections();
  updateNodeClasses();

  if (before) anchorNodeDuringRelayout(anchorId, before);
}

function selectNode(id, { openSheet = true, center = false } = {}) {
  if (!state.nodesById.has(id)) return;
  state.selectedId = id;
  expandAncestors(id);
  updateNodeClasses();
  if (center) centerOnNode(id);
  if (openSheet) openDetails(id);
}

function openDetails(id) {
  const n = state.nodesById.get(id);
  if (!n) return;
  sheetTitle.textContent = n.label || '';
  sheetBody.innerHTML = '';

  const list = [];
  if (Array.isArray(n.details)) list.push(...n.details);
  else if (typeof n.details === 'string' && n.details.trim()) list.push(n.details.trim());

  if (list.length) {
    const ul = document.createElement('ul');
    list.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });
    sheetBody.appendChild(ul);
  } else {
    const p = document.createElement('p');
    p.textContent = '—';
    sheetBody.appendChild(p);
  }

  const hasKids = n.children.length > 0;
  const actionWrap = document.createElement('div');
  actionWrap.style.display = 'flex';
  actionWrap.style.gap = '10px';
  actionWrap.style.marginTop = '12px';

  if (hasKids) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.type = 'button';
    const expanded = state.expanded.has(id);
    btn.innerHTML = `<span class="ico">${expanded ? '–' : '+'}</span><span>${expanded ? 'Colapsar' : 'Expandir'}</span>`;
    btn.addEventListener('click', () => toggleNode(id));
    actionWrap.appendChild(btn);
  }

  const btnCenter = document.createElement('button');
  btnCenter.className = 'btn';
  btnCenter.type = 'button';
  btnCenter.innerHTML = `<span class="ico">◎</span><span>Centralizar</span>`;
  btnCenter.addEventListener('click', () => centerOnNode(id));
  actionWrap.appendChild(btnCenter);

  sheetBody.appendChild(actionWrap);

  scrim.classList.add('open');
  sheet.classList.add('open');
}

function closeSheet() {
  sheet.classList.remove('open');
  scrim.classList.remove('open');
}

function openSearch() {
  scrim.classList.add('open');
  search.classList.add('open');
  searchInput.value = '';
  renderSearch('');
  setTimeout(() => searchInput.focus(), 0);
}

function closeSearch() {
  search.classList.remove('open');
  if (!sheet.classList.contains('open')) scrim.classList.remove('open');
}

function nodePathLabel(id) {
  const parts = [];
  let cur = state.nodesById.get(id);
  while (cur && cur.parentId) {
    cur = state.nodesById.get(cur.parentId);
    if (cur) parts.push(cur.label);
  }
  parts.reverse();
  return parts.join(' › ');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderSearch(q) {
  const query = (q || '').trim().toLowerCase();
  searchList.innerHTML = '';
  const matches = [];
  state.order.forEach(id => {
    const n = state.nodesById.get(id);
    if (!n) return;
    const hay = (n.label || '').toLowerCase();
    if (!query || hay.includes(query)) matches.push(id);
  });

  matches.slice(0, 40).forEach(id => {
    const n = state.nodesById.get(id);
    const item = document.createElement('div');
    item.className = 'searchItem';
    item.innerHTML = `<div class="t">${escapeHtml(n.label)}</div><div class="p">${escapeHtml(nodePathLabel(id))}</div>`;
    item.addEventListener('click', () => {
      closeSearch();
      expandAncestors(id);
      relayout({ fitAfter: false });
      selectNode(id, { openSheet: true, center: true });
    });
    searchList.appendChild(item);
  });
}

const screenToWorld = (sx, sy) => ({ x: (sx - state.tx) / state.s, y: (sy - state.ty) / state.s });

viewport.addEventListener('pointerdown', (e) => {
  const t = e.target;
  if (t && (t.closest('.node') || t.closest('#topbar') || t.closest('#sheet') || t.closest('#searchPanel'))) return;
  viewport.setPointerCapture(e.pointerId);
  state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (state.pointers.size === 1) {
    state.panStart = { x: e.clientX, y: e.clientY, tx: state.tx, ty: state.ty };
    state.pinchStart = null;
  } else if (state.pointers.size === 2) {
    const pts = Array.from(state.pointers.values());
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    const dist = Math.hypot(dx, dy);
    const mx = (pts[0].x + pts[1].x)/2;
    const my = (pts[0].y + pts[1].y)/2;
    const w = screenToWorld(mx, my);
    state.pinchStart = { dist, wx: w.x, wy: w.y, s: state.s };
  }
});

viewport.addEventListener('pointermove', (e) => {
  if (!state.pointers.has(e.pointerId)) return;
  state.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  
  if (state.pointers.size === 1 && state.panStart) {
    const p = state.pointers.get(e.pointerId);
    state.tx = state.panStart.tx + (p.x - state.panStart.x);
    state.ty = state.panStart.ty + (p.y - state.panStart.y);
    applyWorldTransform();
  } else if (state.pointers.size === 2 && state.pinchStart) {
    const pts = Array.from(state.pointers.values());
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    const dist = Math.hypot(dx, dy);
    const scale = state.pinchStart.s * (dist / state.pinchStart.dist);
    const newS = clamp(scale, layoutCfg.minS, layoutCfg.maxS);
    const mx = (pts[0].x + pts[1].x)/2;
    const my = (pts[0].y + pts[1].y)/2;
    const w = screenToWorld(mx, my);
    state.s = newS;
    state.tx = mx - w.x * state.s;
    state.ty = my - w.y * state.s;
    applyWorldTransform();
  }
});

viewport.addEventListener('pointerup', (e) => {
  state.pointers.delete(e.pointerId);
  if (state.pointers.size === 0) {
    state.panStart = null;
    state.pinchStart = null;
  }
  viewport.releasePointerCapture(e.pointerId);
});

viewport.addEventListener('pointercancel', (e) => {
  state.pointers.delete(e.pointerId);
  if (state.pointers.size === 0) {
    state.panStart = null;
    state.pinchStart = null;
  }
  viewport.releasePointerCapture(e.pointerId);
});

btnFit.addEventListener('click', () => fitToScreen());
btn1x.addEventListener('click', () => zoom1x());
btnSearch.addEventListener('click', () => openSearch());
btnCloseSheet.addEventListener('click', () => closeSheet());
btnCloseSearch.addEventListener('click', () => closeSearch());
scrim.addEventListener('click', () => {
  closeSheet();
  closeSearch();
});

searchInput.addEventListener('input', (e) => {
  renderSearch(e.target.value);
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSearch();
});

// Inicializar
loadMap();
})();
