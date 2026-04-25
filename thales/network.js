/* =========================================================
   Thales Weighted Misconception Network
   4 clusters: W Water, M Moisture, S Seeds, Integration
   Style: SVG reference — dark navy bg, coloured cluster nodes,
          thick weighted arrows, edge-weight labels on cross-cluster links
   ========================================================= */

const CLUSTER_COLORS = {
  W:  { fill: '#2563EB', stroke: '#60A5FA', label: 'W Water as Universal Principle' },
  M:  { fill: '#1d4ed8', stroke: '#93C5FD', label: 'M Moisture & Life' },
  S:  { fill: '#7c3aed', stroke: '#a78bfa', label: 'S Seeds & Germination' },
  I:  { fill: '#6366f1', stroke: '#818cf8', label: 'Integration' },
};

const NODES = [
  // W cluster
  { id:'W.00', cluster:'W', label:'Water as\nUniversal Source',   desc:'All matter originates from water; water is the primary substance of the cosmos.', x:0, y:0 },
  { id:'W.01', cluster:'W', label:'Water Transforms\nInto Earth',  desc:'Thales believed water solidifies or condenses to form earth and solid material.', x:0, y:0 },
  { id:'W.02', cluster:'W', label:'Everything\nFloats on Water',   desc:'The earth floats on water; water underlies all existence.', x:0, y:0 },
  { id:'W.03', cluster:'W', label:'Water Gives\nLife Directly',    desc:'Water is not just necessary — it IS the substance of life itself.', x:0, y:0 },
  { id:'W.04', cluster:'W', label:'Wet Origins\nof the Cosmos',    desc:'The cosmos began as a watery chaos; dryness is derivative.', x:0, y:0 },

  // M cluster
  { id:'M.00', cluster:'M', label:'Moisture as\nEssence of Life', desc:'All living things require and ARE fundamentally moisture.', x:0, y:0 },
  { id:'M.01', cluster:'M', label:'Wilting as\nWater Loss',        desc:'When plants wilt, they are losing their primary substance, not just a carrier fluid.', x:0, y:0 },
  { id:'M.02', cluster:'M', label:'Irrigation\nBuilds Mass',       desc:'Watered fields produce more; therefore water directly builds plant body.', x:0, y:0 },
  { id:'M.03', cluster:'M', label:'Flood Plain\nFertility',        desc:'Flood-plain soils support lush growth — proof water delivered from rivers builds life.', x:0, y:0 },
  { id:'M.04', cluster:'M', label:'Sap as\nConcentrated Water',   desc:'The sap running in plants is just water in a more refined or concentrated form.', x:0, y:0 },

  // S cluster
  { id:'S.00', cluster:'S', label:'Seed Awakened\nby Water',      desc:'Seeds only germinate when watered — water awakens and provides the material for growth.', x:0, y:0 },
  { id:'S.01', cluster:'S', label:'Germination Proves\nWater Builds', desc:'The rapid mass gain during germination appears to come entirely from water.', x:0, y:0 },
  { id:'S.02', cluster:'S', label:'Dry Seeds\nAre Dead/Dormant',  desc:'Dryness equals dormancy or death; wetness equals life — so life substance is water.', x:0, y:0 },
  { id:'S.03', cluster:'S', label:'Root Drinks\nWater for Mass',  desc:'Roots absorb water; this absorbed water must become the plant\'s solid body.', x:0, y:0 },

  // Integration
  { id:'I.00', cluster:'I', label:'Water Is Necessary\nNot Sufficient', desc:'Water is essential for life but is not itself transformed into the bulk of plant matter.', x:0, y:0 },
  { id:'I.01', cluster:'I', label:'Carrier vs\nSubstance',        desc:'Distinguishing water as a carrier of minerals from water as the plant\'s body material.', x:0, y:0 },
];

// Edges: {s, t, weight, type, crossCluster}
const EDGES = [
  // W within
  { s:'W.00', t:'W.01', w:0.88, type:'implies' },
  { s:'W.00', t:'W.03', w:0.85, type:'supports' },
  { s:'W.01', t:'W.04', w:0.76, type:'supports' },
  { s:'W.02', t:'W.00', w:0.80, type:'supports' },
  { s:'W.03', t:'W.04', w:0.72, type:'implies' },
  // M within
  { s:'M.00', t:'M.01', w:0.84, type:'supports' },
  { s:'M.02', t:'M.00', w:0.88, type:'supports' },
  { s:'M.03', t:'M.02', w:0.82, type:'supports' },
  { s:'M.04', t:'M.00', w:0.76, type:'implies' },
  { s:'M.01', t:'M.04', w:0.70, type:'hides' },
  // S within
  { s:'S.00', t:'S.01', w:0.90, type:'implies' },
  { s:'S.02', t:'S.00', w:0.86, type:'supports' },
  { s:'S.01', t:'S.03', w:0.84, type:'implies' },
  { s:'S.03', t:'M.04', w:0.78, type:'bridges_to' },
  // Cross-cluster
  { s:'W.03', t:'M.00', w:0.92, type:'bridges_to', cross:true },
  { s:'M.02', t:'S.01', w:0.86, type:'bridges_to', cross:true },
  { s:'W.01', t:'S.00', w:0.80, type:'bridges_to', cross:true },
  { s:'S.01', t:'I.00', w:0.88, type:'corrective_bridge', cross:true },
  { s:'M.04', t:'I.01', w:0.84, type:'corrective_bridge', cross:true },
  { s:'I.00', t:'W.00', w:0.60, type:'bridges_to', cross:true, dashed:true },
];

// ── Canvas setup ──────────────────────────────────────────
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

let W, H, nodes, edges, tooltip, hoveredNode = null, animFrame;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  layoutNodes();
  draw();
}

// ── Cluster layout: position nodes in regions ──────────
function layoutNodes() {
  // Define cluster centres as fraction of canvas
  const centres = {
    W:  { cx: 0.28, cy: 0.38 },
    M:  { cx: 0.65, cy: 0.35 },
    S:  { cx: 0.50, cy: 0.70 },
    I:  { cx: 0.50, cy: 0.52 },
  };

  // Group nodes by cluster
  const byCluster = {};
  NODES.forEach(n => { (byCluster[n.cluster] = byCluster[n.cluster]||[]).push(n); });

  Object.entries(byCluster).forEach(([cl, list]) => {
    const c = centres[cl];
    const cx = c.cx * W, cy = c.cy * H;
    const count = list.length;
    // Spread in a circle, radius scales with count
    const r = Math.min(W, H) * (cl === 'I' ? 0.07 : 0.12 + count * 0.008);
    list.forEach((n, i) => {
      const angle = (2 * Math.PI * i / count) - Math.PI / 2;
      n.x = cx + r * Math.cos(angle);
      n.y = cy + r * Math.sin(angle);
      n.r = getRadius(n);
      n.vx = 0; n.vy = 0;
    });
  });
}

function getRadius(n) {
  // Integration nodes slightly larger
  if (n.cluster === 'I') return 22;
  // Entry/key nodes
  const key = ['W.00','W.03','M.00','S.01','I.00'];
  return key.includes(n.id) ? 20 : 15;
}

// ── Force simulation (short warm-up) ─────────────────────
function runForces(iterations) {
  const nodeMap = {};
  NODES.forEach(n => nodeMap[n.id] = n);
  const builtEdges = EDGES.map(e => ({ s: nodeMap[e.s], t: nodeMap[e.t], ...e }))
                          .filter(e => e.s && e.t);

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion between all nodes
    for (let i = 0; i < NODES.length; i++) {
      for (let j = i+1; j < NODES.length; j++) {
        const a = NODES[i], b = NODES[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const force = 3000 / (dist * dist);
        const fx = (dx/dist)*force, fy = (dy/dist)*force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }
    // Same-cluster attraction (spring)
    builtEdges.forEach(e => {
      if (e.cross) return; // skip cross-cluster for spring
      const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const target = 90;
      const force = (dist - target) * 0.04;
      const fx = (dx/dist)*force, fy = (dy/dist)*force;
      e.s.vx += fx; e.s.vy += fy;
      e.t.vx -= fx; e.t.vy -= fy;
    });
    // Cluster-centre gravity
    const centres = { W:{cx:0.28,cy:0.38}, M:{cx:0.65,cy:0.35}, S:{cx:0.50,cy:0.70}, I:{cx:0.50,cy:0.52} };
    NODES.forEach(n => {
      const c = centres[n.cluster];
      n.vx += (c.cx * W - n.x) * 0.015;
      n.vy += (c.cy * H - n.y) * 0.015;
      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.6; n.vy *= 0.6;
      // Clamp to canvas
      n.x = Math.max(n.r+10, Math.min(W - n.r - 10, n.x));
      n.y = Math.max(n.r+10, Math.min(H - n.r - 10, n.y));
    });
  }
}

// ── Drawing ───────────────────────────────────────────────
function edgeColor(e) {
  if (e.cross) return '#e8ffff';
  return CLUSTER_COLORS[NODES.find(n=>n.id===e.s)?.cluster]?.stroke || '#e8ffff';
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0A1428');
  bg.addColorStop(1, '#0f1e3d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const nodeMap = {};
  NODES.forEach(n => nodeMap[n.id] = n);
  const builtEdges = EDGES.map(e => ({ ...e, sn: nodeMap[e.s], tn: nodeMap[e.t] }))
                          .filter(e => e.sn && e.tn);

  // Draw cluster halos
  const clusterGroups = {};
  NODES.forEach(n => { (clusterGroups[n.cluster] = clusterGroups[n.cluster]||[]).push(n); });
  Object.entries(clusterGroups).forEach(([cl, list]) => {
    const col = CLUSTER_COLORS[cl];
    const cx = list.reduce((s,n)=>s+n.x,0)/list.length;
    const cy = list.reduce((s,n)=>s+n.y,0)/list.length;
    const maxR = Math.max(...list.map(n => Math.sqrt((n.x-cx)**2+(n.y-cy)**2))) + 40;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, col.fill + '18');
    grad.addColorStop(1, col.fill + '00');
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
  });

  // Draw edges
  builtEdges.forEach(e => {
    const { sn, tn, w, cross, dashed } = e;
    const col = edgeColor(e);
    const isHovered = hoveredNode && (sn.id === hoveredNode.id || tn.id === hoveredNode.id);
    const isConnected = isHovered;
    const alpha = hoveredNode ? (isConnected ? 1.0 : 0.15) : 0.65;
    const lineW = cross ? Math.max(2, w * 6) : Math.max(1.5, w * 4);

    // Arrow direction: offset from centre toward edge of circle
    const dx = tn.x - sn.x, dy = tn.y - sn.y;
    const dist = Math.sqrt(dx*dx+dy*dy)||1;
    const sx = sn.x + (dx/dist)*sn.r;
    const sy = sn.y + (dy/dist)*sn.r;
    const tx = tn.x - (dx/dist)*(tn.r+8);
    const ty = tn.y - (dy/dist)*(tn.r+8);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = col;
    ctx.lineWidth = lineW;
    if (dashed) ctx.setLineDash([8, 8]);
    else ctx.setLineDash([]);

    // Slight curve for cross-cluster edges
    ctx.beginPath();
    if (cross) {
      const mx = (sx+tx)/2 + (dy/dist)*30;
      const my = (sy+ty)/2 - (dx/dist)*30;
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(mx, my, tx, ty);
    } else {
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrowhead
    const angle = Math.atan2(ty-sy, tx-sx);
    const aLen = 10 + lineW;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - aLen*Math.cos(angle-0.35), ty - aLen*Math.sin(angle-0.35));
    ctx.lineTo(tx - aLen*Math.cos(angle+0.35), ty - aLen*Math.sin(angle+0.35));
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    // Weight label on cross-cluster edges
    if (cross && w >= 0.70) {
      let lx, ly;
      if (cross) {
        const mx = (sx+tx)/2 + (dy/dist)*30;
        const my = (sy+ty)/2 - (dx/dist)*30;
        lx = mx; ly = my;
      } else {
        lx = (sx+tx)/2; ly = (sy+ty)/2;
      }
      ctx.font = 'bold 11px "Didact Gothic", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#0A1428';
      ctx.lineWidth = 4;
      ctx.strokeText(w.toFixed(2), lx, ly);
      ctx.fillStyle = '#c9eef7';
      ctx.fillText(w.toFixed(2), lx, ly);
    }

    ctx.restore();
  });

  // Draw nodes
  NODES.forEach(n => {
    const col = CLUSTER_COLORS[n.cluster];
    const isHovered = hoveredNode && n.id === hoveredNode.id;
    const isConnected = hoveredNode && builtEdges.some(e =>
      (e.sn.id === hoveredNode.id && e.tn.id === n.id) ||
      (e.tn.id === hoveredNode.id && e.sn.id === n.id)
    );
    const dimmed = hoveredNode && !isHovered && !isConnected;
    const alpha = dimmed ? 0.25 : 1.0;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Glow
    if (isHovered || isConnected) {
      const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r*3);
      glow.addColorStop(0, col.fill + '55');
      glow.addColorStop(1, col.fill + '00');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r*3, 0, Math.PI*2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

    // Node circle
    const nodeGrad = ctx.createRadialGradient(n.x - n.r*0.3, n.y - n.r*0.3, 0, n.x, n.y, n.r);
    nodeGrad.addColorStop(0, col.stroke);
    nodeGrad.addColorStop(1, col.fill);
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fillStyle = nodeGrad;
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#ffffff' : col.stroke;
    ctx.lineWidth = isHovered ? 2.5 : 1.4;
    ctx.stroke();

    // Label
    const lines = n.label.split('\n');
    ctx.font = `${n.r > 18 ? 11 : 10}px "Didact Gothic", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e8fbff';
    const labelY = n.y + n.r + 14;
    lines.forEach((line, i) => {
      ctx.fillText(line, n.x, labelY + i*13 - (lines.length-1)*6.5);
    });

    ctx.restore();
  });

  // Cluster title labels
  const centres = { W:{cx:0.28,cy:0.38}, M:{cx:0.65,cy:0.35}, S:{cx:0.50,cy:0.70}, I:{cx:0.50,cy:0.52} };
  Object.entries(CLUSTER_COLORS).forEach(([cl, col]) => {
    const c = centres[cl];
    if (!c) return;
    ctx.save();
    ctx.globalAlpha = hoveredNode ? 0.4 : 0.85;
    ctx.font = 'bold 13px "Didact Gothic", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = col.stroke;
    ctx.fillText(col.label, c.cx * W, c.cy * H - 110);
    ctx.restore();
  });
}

// ── Tooltip / Hover ───────────────────────────────────────
function getHovered(mx, my) {
  for (let i = NODES.length-1; i >= 0; i--) {
    const n = NODES[i];
    if ((mx-n.x)**2 + (my-n.y)**2 <= (n.r+6)**2) return n;
  }
  return null;
}

function showTooltip(n, px, py) {
  const tip = document.getElementById('tooltip');
  if (!tip) return;
  tip.querySelector('.tip-title').textContent = n.label.replace('\n',' ');
  tip.querySelector('.tip-cluster').textContent = CLUSTER_COLORS[n.cluster].label;
  tip.querySelector('.tip-desc').textContent = n.desc;
  tip.style.display = 'block';
  const rect = canvas.getBoundingClientRect();
  let left = px + 16, top = py - 10;
  if (left + 260 > rect.right) left = px - 270;
  tip.style.left = left + 'px';
  tip.style.top  = top  + 'px';
}

function hideTooltip() {
  const tip = document.getElementById('tooltip');
  if (tip) tip.style.display = 'none';
}

function onMove(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
  const my = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
  const found = getHovered(mx, my);
  if (found !== hoveredNode) {
    hoveredNode = found;
    if (found) { showTooltip(found, e.clientX||e.touches?.[0]?.clientX, e.clientY||e.touches?.[0]?.clientY); canvas.style.cursor='pointer'; }
    else        { hideTooltip(); canvas.style.cursor='default'; }
    draw();
  } else if (found) {
    showTooltip(found, e.clientX||e.touches?.[0]?.clientX, e.clientY||e.touches?.[0]?.clientY);
  }
}

canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('touchmove', e => { e.preventDefault(); onMove(e); }, { passive:false });
canvas.addEventListener('mouseleave', () => { hoveredNode=null; hideTooltip(); draw(); });

// ── Legend ────────────────────────────────────────────────
function drawLegend() {
  const leg = document.getElementById('network-legend');
  if (!leg) return;
  leg.innerHTML = Object.entries(CLUSTER_COLORS).map(([cl,col]) =>
    `<span class="leg-item"><span class="leg-dot" style="background:${col.fill};box-shadow:0 0 6px ${col.stroke}88;border:1.5px solid ${col.stroke}"></span>${col.label}</span>`
  ).join('') +
  `<span class="leg-item"><span class="leg-line" style="background:#e8ffff"></span>Cross-cluster link (weight shown)</span>`;
}

// ── Init ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  resize();
  runForces(300);
  draw();
  drawLegend();
});
window.addEventListener('resize', () => { resize(); runForces(150); draw(); });
