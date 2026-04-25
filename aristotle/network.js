/* =========================================================
   Aristotle Weighted Misconception Network
   4 clusters: M1 Soil, M2 Water, M3 Air, M4 Light + Integration
   Style: SVG reference — dark navy bg, coloured cluster nodes,
          thick weighted arrows, edge-weight labels on cross-cluster links
   ========================================================= */

const CLUSTER_COLORS = {
  M1: { fill: '#c7833f', stroke: '#f6b66b', label: 'M1 Soil / Humus / External Stomach' },
  M2: { fill: '#2db6ff', stroke: '#69cfff', label: 'M2 Water as Substance' },
  M3: { fill: '#54d6c8', stroke: '#7df3e4', label: 'M3 Air as Empty or Weightless' },
  M4: { fill: '#ffd35a', stroke: '#ffe37b', label: 'M4 Light / Energy as Mass' },
  I:  { fill: '#b782ff', stroke: '#c9a2ff', label: 'Integration' },
};

const NODES = [
  // M1 Soil cluster
  { id:'M1.00', cluster:'M1', label:'Soil as\nSole Source',       desc:'The plant\'s body comes primarily from soil or earth-derived substance.',             x:0, y:0 },
  { id:'M1.01', cluster:'M1', label:'Humus as\nPlant Food',        desc:'Decayed organic matter is the plant\'s food.',                                        x:0, y:0 },
  { id:'M1.02', cluster:'M1', label:'Like\nNourishes Like',        desc:'Living bodies are nourished by matter similar to themselves.',                         x:0, y:0 },
  { id:'M1.03', cluster:'M1', label:'Plant-Animal\nAnalogy',        desc:'Plants should be understood by analogy with animal feeding.',                          x:0, y:0 },
  { id:'M1.04', cluster:'M1', label:'Earth as\nExternal Stomach',   desc:'Soil digests or prepares food outside the plant body.',                               x:0, y:0 },
  { id:'M1.05', cluster:'M1', label:'Pre-Elaborated\nFood',         desc:'Food is already prepared in soil before root uptake.',                                 x:0, y:0 },
  { id:'M1.06', cluster:'M1', label:'Passive\nAbsorption',          desc:'The plant passively receives prepared food rather than synthesising it.',              x:0, y:0 },
  { id:'M1.07', cluster:'M1', label:'Roots as\nSole Organ',         desc:'Roots are the only or primary feeding organs.',                                        x:0, y:0 },
  { id:'M1.08', cluster:'M1', label:'Leaves Have\nNo Nutritive Role',desc:'Leaves are not central to nutrition or mass-building.',                              x:0, y:0 },
  { id:'M1.09', cluster:'M1', label:'No Internal\nChemistry',        desc:'The plant does not transform raw materials chemically into new substances.',          x:0, y:0 },
  { id:'M1.10', cluster:'M1', label:'Growth as\nAccretion',          desc:'Growth is addition of prepared material, not transformation.',                        x:0, y:0 },
  { id:'M1.14', cluster:'M1', label:'Water as\nVehicle Only',        desc:'Water\'s role is to carry soil nourishment, not to be the main substance.',          x:0, y:0 },
  { id:'M1.15', cluster:'M1', label:'Manure & Ash\nFertility',       desc:'Manure, compost, ash improve growth — so soil materials must build plants.',         x:0, y:0 },
  { id:'M1.17', cluster:'M1', label:'Aquatic Plant\nPressure',       desc:'Aquatic plants challenge soil dependence — interpreted as water-carried nourishment.',x:0, y:0 },
  { id:'M1.18', cluster:'M1', label:'Nutrients\nas Vitamins',        desc:'Soil nutrients are essential but confused with the main source of mass.',             x:0, y:0 },

  // M2 Water cluster
  { id:'M2.00', cluster:'M2', label:'Water as\nSole Source',         desc:'Plant body comes mainly or entirely from water.',                                     x:0, y:0 },
  { id:'M2.02', cluster:'M2', label:'Visible Water\nDependence',     desc:'Plants wilt without water and revive when watered.',                                  x:0, y:0 },
  { id:'M2.04', cluster:'M2', label:'Van Helmont\nBalance',           desc:'Willow gained mass while soil stayed nearly constant.',                               x:0, y:0 },
  { id:'M2.05', cluster:'M2', label:'Soil Mass\nUnchanged',           desc:'Soil loss was too small to explain plant gain.',                                      x:0, y:0 },
  { id:'M2.06', cluster:'M2', label:'Added Input\nWas Water',         desc:'Water was the only visible added input.',                                             x:0, y:0 },
  { id:'M2.08', cluster:'M2', label:'Water Carries\nDissolved Earth', desc:'Water carries hidden soil nutrients or particles.',                                   x:0, y:0 },
  { id:'M2.09', cluster:'M2', label:'Fresh vs\nDry Mass',             desc:'Plant wetness is confused with dry biomass source.',                                  x:0, y:0 },

  // M3 Air cluster
  { id:'M3.00', cluster:'M3', label:'Air as\nEmpty Space',            desc:'Air is treated as nothing or near nothing.',                                          x:0, y:0 },
  { id:'M3.01', cluster:'M3', label:'Air as\nWeightless',             desc:'Air seems to have no weight and cannot explain mass.',                                x:0, y:0 },
  { id:'M3.03', cluster:'M3', label:'Invisible Cannot\nBuild Visible', desc:'Invisible inputs are discounted as sources of solid bodies.',                       x:0, y:0 },
  { id:'M3.08', cluster:'M3', label:'Gas Exchange\nIgnored',           desc:'Intake and release of gases are not counted as material exchange.',                 x:0, y:0 },
  { id:'M3.09', cluster:'M3', label:'Carbon in Air\nIs Unintuitive',  desc:'It is hard to imagine carbon stored in invisible air.',                              x:0, y:0 },
  { id:'M3.10', cluster:'M3', label:'Atmosphere\nNot Weighed',        desc:'Experiments count soil and water but omit atmospheric input.',                       x:0, y:0 },
  { id:'M3.12', cluster:'M3', label:'Air as Invisible\nStorehouse',   desc:'Corrective bridge: air can be imagined as a storehouse of carbon.',                 x:0, y:0 },
  { id:'M3.13', cluster:'M3', label:'Leaf as\nDoorway',               desc:'Corrective bridge: leaves are the entry point for atmospheric CO₂.',                x:0, y:0 },

  // M4 Light cluster
  { id:'M4.01', cluster:'M4', label:'Sun Causes\nGrowth',             desc:'Because plants grow in sunlight, sunlight is mistaken as material source.',          x:0, y:0 },
  { id:'M4.05', cluster:'M4', label:'Energy\nBecomes Mass',           desc:'Energy is assumed to convert directly into plant mass.',                             x:0, y:0 },
  { id:'M4.07', cluster:'M4', label:'Darkness\nMeans No Food',        desc:'Darkness stopping photosynthesis is misread as proof light is the food.',            x:0, y:0 },
  { id:'M4.08', cluster:'M4', label:'Leaf as\nWorkshop',              desc:'Corrective bridge: leaves rearrange matter using light energy.',                     x:0, y:0 },
  { id:'M4.09', cluster:'M4', label:'Light as\nWorker',               desc:'Corrective bridge: light powers work but is not the brick.',                        x:0, y:0 },
  { id:'M4.10', cluster:'M4', label:'Matter-Energy\nConfusion',       desc:'The student has not separated matter inputs from energy input.',                     x:0, y:0 },

  // Integration
  { id:'I.00',  cluster:'I',  label:'Four Offices:\nSoil Water Air Light', desc:'Soil, water, air, and light each receive a distinct role.',                    x:0, y:0 },
  { id:'I.01',  cluster:'I',  label:'Necessary\nvs Sufficient',       desc:'Something can be essential without being the main source of mass.',                  x:0, y:0 },
  { id:'I.02',  cluster:'I',  label:'Matter-Energy\nDistinction',     desc:'Matter inputs and energy input must be separated.',                                  x:0, y:0 },
];

// Edges: {s, t, weight, type, crossCluster}
const EDGES = [
  // M1 within
  { s:'M1.00', t:'M1.01', w:0.88, type:'supports' },
  { s:'M1.00', t:'M1.07', w:0.86, type:'supports' },
  { s:'M1.01', t:'M1.15', w:0.86, type:'supports' },
  { s:'M1.01', t:'M1.02', w:0.80, type:'implies' },
  { s:'M1.02', t:'M1.03', w:0.72, type:'implies' },
  { s:'M1.03', t:'M1.04', w:0.92, type:'implies' },
  { s:'M1.04', t:'M1.05', w:0.90, type:'implies' },
  { s:'M1.05', t:'M1.06', w:0.88, type:'implies' },
  { s:'M1.06', t:'M1.09', w:0.82, type:'hides' },
  { s:'M1.09', t:'M1.10', w:0.84, type:'implies' },
  { s:'M1.07', t:'M1.08', w:0.78, type:'implies' },
  { s:'M1.07', t:'M1.14', w:0.68, type:'supports' },
  { s:'M1.08', t:'M1.09', w:0.74, type:'supports' },
  { s:'M1.15', t:'M1.17', w:0.84, type:'retreats_to' },

  // M2 within
  { s:'M2.02', t:'M2.00', w:0.84, type:'supports' },
  { s:'M2.04', t:'M2.05', w:0.92, type:'supports' },
  { s:'M2.04', t:'M2.06', w:0.94, type:'supports' },
  { s:'M2.05', t:'M2.00', w:0.82, type:'supports' },
  { s:'M2.06', t:'M2.00', w:0.86, type:'supports' },
  { s:'M2.08', t:'M2.00', w:0.76, type:'retreats_to' },

  // M3 within
  { s:'M3.00', t:'M3.01', w:0.90, type:'supports' },
  { s:'M3.01', t:'M3.03', w:0.88, type:'supports' },
  { s:'M3.03', t:'M3.09', w:0.86, type:'supports' },
  { s:'M3.08', t:'M3.10', w:0.84, type:'supports' },
  { s:'M3.09', t:'M3.12', w:0.86, type:'corrective_bridge' },
  { s:'M3.12', t:'M3.13', w:0.84, type:'corrective_bridge' },

  // M4 within
  { s:'M4.01', t:'M4.07', w:0.76, type:'supports' },
  { s:'M4.05', t:'M4.10', w:0.90, type:'supports' },
  { s:'M4.08', t:'M4.09', w:0.88, type:'corrective_bridge' },
  { s:'M4.09', t:'M4.10', w:0.86, type:'challenges' },
  { s:'M4.08', t:'M4.01', w:0.78, type:'bridges_to' },

  // Cross-cluster (shown with weight labels)
  { s:'M1.18', t:'M3.09', w:0.90, type:'bridges_to', cross:true },
  { s:'M1.17', t:'M2.08', w:0.88, type:'bridges_to', cross:true },
  { s:'M2.04', t:'M3.10', w:0.94, type:'bridges_to', cross:true },
  { s:'M2.09', t:'M3.09', w:0.72, type:'bridges_to', cross:true },
  { s:'M3.10', t:'M2.04', w:0.88, type:'bridges_to', cross:true },
  { s:'M3.13', t:'M4.08', w:0.90, type:'bridges_to', cross:true },
  { s:'M4.09', t:'I.02',  w:0.92, type:'corrective_bridge', cross:true },
  { s:'M4.10', t:'I.00',  w:0.88, type:'corrective_bridge', cross:true },
  { s:'M1.18', t:'I.01',  w:0.82, type:'bridges_to', cross:true },
  { s:'I.00',  t:'M1.15', w:0.58, type:'bridges_to', cross:true, dashed:true },
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

// ── Cluster layout: position nodes in 5 regions ──────────
function layoutNodes() {
  // Define cluster centres as fraction of canvas
  const centres = {
    M1: { cx: 0.22, cy: 0.42 },
    M2: { cx: 0.50, cy: 0.35 },
    M3: { cx: 0.75, cy: 0.38 },
    M4: { cx: 0.72, cy: 0.72 },
    I:  { cx: 0.45, cy: 0.78 },
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
  const key = ['M1.00','M1.04','M2.04','M3.09','M4.10'];
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
    const centres = { M1:{cx:0.22,cy:0.42}, M2:{cx:0.50,cy:0.35}, M3:{cx:0.75,cy:0.38}, M4:{cx:0.72,cy:0.72}, I:{cx:0.45,cy:0.78} };
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
  bg.addColorStop(0, '#071827');
  bg.addColorStop(1, '#0b1f35');
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
      ctx.strokeStyle = '#071827';
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
  const centres = { M1:{cx:0.22,cy:0.42}, M2:{cx:0.50,cy:0.35}, M3:{cx:0.75,cy:0.38}, M4:{cx:0.72,cy:0.72}, I:{cx:0.45,cy:0.78} };
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
