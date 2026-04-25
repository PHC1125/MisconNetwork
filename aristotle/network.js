// === Aristotle's Network of Misconception — Interactive Visualisation ===

(function () {
  'use strict';

  // ─── Data ───
  const nodes = [
    { id: 0,  name: 'Like Nourishes Like',           desc: 'The metaphysical principle that every living thing feeds on materials of a similar nature to itself. Organic beings must consume organic food.' },
    { id: 1,  name: 'Plant–Animal Analogy',           desc: 'Plants are compared to animals: since animals eat organic matter, plants must also consume pre-formed organic material.' },
    { id: 2,  name: 'Humus as Plant Food',             desc: 'The decaying animal and vegetable matter (humus) in soil is identified as the primary food source of plants.' },
    { id: 3,  name: 'Soil as Sole Source',             desc: 'All plant nourishment comes from the soil. The atmosphere and sunlight play no nutritive role.' },
    { id: 4,  name: 'Earth as External Stomach',       desc: 'The soil functions like a stomach: it elaborates (pre-digests) organic matter into ready-made food before the plant absorbs it.' },
    { id: 5,  name: 'Pre-Elaborated Food',             desc: 'The nutritive material in soil is already fully processed and refined before the plant takes it up — no further transformation is needed.' },
    { id: 6,  name: 'Passive Absorption',              desc: 'Plants play a passive role in nutrition — they simply absorb what the earth has already prepared, without performing any chemical work.' },
    { id: 7,  name: 'No Excretion',                    desc: 'Plants produce no waste or excrement, unlike animals. This observation is used to argue that plants select only what they need.' },
    { id: 8,  name: 'Perfect Selectivity',             desc: 'Because plants produce no waste, they must possess a perfect ability to absorb only the exact substances required for their structure.' },
    { id: 9,  name: 'No Internal Chemistry',           desc: 'Plants do not perform any chemical transformation on their food. There is no synthesis, no digestion, and no metabolic conversion inside the plant.' },
    { id: 10, name: 'Growth as Accretion',             desc: 'Plant growth is a process of gradual accumulation of pre-made material — without any accompanying chemical change.' },
    { id: 11, name: 'Roots as Sole Organ',             desc: 'The roots are the only organs involved in obtaining nutrition. All food enters the plant through the roots from the soil.' },
    { id: 12, name: 'Leaves Have No Nutritive Role',   desc: 'Leaves and aerial parts of the plant are not involved in nutrition. They serve structural purposes but do not contribute to feeding.' },
    { id: 13, name: 'Water as Vehicle Only',           desc: 'Water is not itself a food — it merely serves as a carrier that delivers dissolved organic substances from the soil to the roots.' },
    { id: 14, name: 'Diversity of Soil Substances',    desc: 'The soil contains as many different nutritive substances as there are different flavours and types of plants. Soil diversity explains plant diversity.' },
    { id: 15, name: 'Ignorance of Atmospheric Gases',  desc: 'No knowledge existed of air as a mixture of gases. The idea that an invisible gas could become solid plant matter was inconceivable.' },
  ];

  // Edges: [sourceId, targetId]
  const edges = [
    [0, 2],   // Like Nourishes Like → Humus as Plant Food
    [0, 1],   // Like Nourishes Like → Plant–Animal Analogy
    [1, 2],   // Plant–Animal Analogy → Humus as Plant Food
    [1, 4],   // Plant–Animal Analogy → Earth as External Stomach
    [1, 7],   // Plant–Animal Analogy → No Excretion
    [2, 3],   // Humus as Plant Food → Soil as Sole Source
    [2, 14],  // Humus as Plant Food → Diversity of Soil Substances
    [3, 4],   // Soil as Sole Source → Earth as External Stomach
    [3, 11],  // Soil as Sole Source → Roots as Sole Organ
    [4, 5],   // Earth as External Stomach → Pre-Elaborated Food
    [4, 6],   // Earth as External Stomach → Passive Absorption
    [5, 6],   // Pre-Elaborated Food → Passive Absorption
    [5, 10],  // Pre-Elaborated Food → Growth as Accretion
    [6, 10],  // Passive Absorption → Growth as Accretion
    [6, 9],   // Passive Absorption → No Internal Chemistry
    [7, 8],   // No Excretion → Perfect Selectivity
    [8, 6],   // Perfect Selectivity → Passive Absorption
    [8, 9],   // Perfect Selectivity → No Internal Chemistry
    [8, 11],  // Perfect Selectivity → Roots as Sole Organ
    [9, 10],  // No Internal Chemistry → Growth as Accretion
    [9, 12],  // No Internal Chemistry → Leaves Have No Nutritive Role
    [11, 12], // Roots as Sole Organ → Leaves Have No Nutritive Role
    [3, 12],  // Soil as Sole Source → Leaves Have No Nutritive Role
    [13, 2],  // Water as Vehicle Only → Humus as Plant Food
    [13, 3],  // Water as Vehicle Only → Soil as Sole Source
    [13, 14], // Water as Vehicle Only → Diversity of Soil Substances
    [15, 3],  // Ignorance of Atmospheric Gases → Soil as Sole Source
    [15, 12], // Ignorance of Atmospheric Gases → Leaves Have No Nutritive Role
    [15, 9],  // Ignorance of Atmospheric Gases → No Internal Chemistry
  ];

  // ─── Canvas setup ───
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('canvas-container');
  const tooltip = document.getElementById('tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipDesc = document.getElementById('tooltip-desc');
  const tooltipConns = document.getElementById('tooltip-connections');

  let W, H, dpr;
  let hoveredNode = null;
  let mouseX = 0, mouseY = 0;
  let animTime = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layoutNodes();
  }

  // ─── Layout: force-directed (simple spring model) ───
  function layoutNodes() {
    // Initial placement in a roughly circular pattern with some variety
    const cx = W / 2;
    const cy = H / 2;
    const radiusX = Math.min(W, 900) * 0.38;
    const radiusY = Math.min(H, 700) * 0.38;

    nodes.forEach((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      // Add slight radial variation for visual interest
      const rVar = 0.85 + (Math.sin(i * 2.7) * 0.15);
      n.x = cx + Math.cos(angle) * radiusX * rVar;
      n.y = cy + Math.sin(angle) * radiusY * rVar;
      n.vx = 0;
      n.vy = 0;
    });

    // Run force simulation
    for (let iter = 0; iter < 300; iter++) {
      const alpha = 1 - iter / 300;

      // Repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[j].x - nodes[i].x;
          let dy = nodes[j].y - nodes[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 1;
          let repStrength = W < 500 ? 18000 : 12000;
      let force = repStrength / (dist * dist);
          let fx = (dx / dist) * force;
          let fy = (dy / dist) * force;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }

      // Attraction along edges
      edges.forEach(([a, b]) => {
        let dx = nodes[b].x - nodes[a].x;
        let dy = nodes[b].y - nodes[a].y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let idealDist = Math.min(W, H) * 0.18;
        let force = (dist - idealDist) * 0.005;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        nodes[a].vx += fx;
        nodes[a].vy += fy;
        nodes[b].vx -= fx;
        nodes[b].vy -= fy;
      });

      // Center gravity
      nodes.forEach(n => {
        n.vx += (cx - n.x) * 0.002;
        n.vy += (cy - n.y) * 0.002;
      });

      // Apply velocity with damping
      nodes.forEach(n => {
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx * alpha;
        n.y += n.vy * alpha;

        // Boundary constraints with padding
        const pad = 60;
        n.x = Math.max(pad, Math.min(W - pad, n.x));
        n.y = Math.max(pad, Math.min(H - pad, n.y));
      });
    }
  }

  // ─── Drawing ───
  function getConnectedEdges(nodeId) {
    return edges.filter(([a, b]) => a === nodeId || b === nodeId);
  }

  function getConnectedNodeIds(nodeId) {
    const ids = new Set();
    edges.forEach(([a, b]) => {
      if (a === nodeId) ids.add(b);
      if (b === nodeId) ids.add(a);
    });
    return ids;
  }

  function draw() {
    animTime += 0.015;
    ctx.clearRect(0, 0, W, H);

    const connectedIds = hoveredNode !== null ? getConnectedNodeIds(hoveredNode.id) : new Set();
    const isHovering = hoveredNode !== null;

    // Draw edges
    edges.forEach(([a, b]) => {
      const na = nodes[a];
      const nb = nodes[b];
      const isHighlighted = isHovering && (a === hoveredNode.id || b === hoveredNode.id);
      const isDimmed = isHovering && !isHighlighted;

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);

      if (isHighlighted) {
        // Glowing highlighted edge
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
        ctx.shadowBlur = 12;
      } else if (isDimmed) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    nodes.forEach(n => {
      const isActive = isHovering && hoveredNode.id === n.id;
      const isConnected = isHovering && connectedIds.has(n.id);
      const isDimmed = isHovering && !isActive && !isConnected;

      // Node radius
      const baseRadius = isActive ? 18 : (isConnected ? 13 : 10);
      const pulseRadius = isActive ? baseRadius + Math.sin(animTime * 3) * 2 : baseRadius;

      // Outer glow
      if (isActive || isConnected) {
        const glowGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseRadius * 3);
        glowGrad.addColorStop(0, isActive ? 'rgba(6, 182, 212, 0.35)' : 'rgba(45, 212, 191, 0.2)');
        glowGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Node body
      const grad = ctx.createRadialGradient(n.x - pulseRadius * 0.3, n.y - pulseRadius * 0.3, 0, n.x, n.y, pulseRadius);
      if (isDimmed) {
        grad.addColorStop(0, 'rgba(40, 70, 120, 0.5)');
        grad.addColorStop(1, 'rgba(20, 40, 80, 0.3)');
      } else {
        grad.addColorStop(0, isActive ? '#06B6D4' : (isConnected ? '#1e9ab0' : '#1882a0'));
        grad.addColorStop(1, isActive ? '#2DD4BF' : (isConnected ? '#15736a' : '#0d5060'));
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      if (!isDimmed) {
        ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.6)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
      }

      // Label
      const labelAlpha = isDimmed ? 0.2 : (isActive ? 1 : (isConnected ? 0.9 : 0.7));
      ctx.fillStyle = `rgba(240, 244, 248, ${labelAlpha})`;
      ctx.font = `${isActive ? 'bold ' : ''}${isActive ? '13px' : '11px'} 'Didact Gothic', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Word wrap for labels
      const label = n.name;
      const maxLabelWidth = isActive ? 150 : 110;
      const words = label.split(' ');
      const lines = [];
      let currentLine = words[0];
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        if (ctx.measureText(testLine).width > maxLabelWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      const lineHeight = isActive ? 15 : 13;
      const labelY = n.y + pulseRadius + 6;
      lines.forEach((line, li) => {
        ctx.fillText(line, n.x, labelY + li * lineHeight);
      });
    });

    requestAnimationFrame(draw);
  }

  // ─── Hit testing ───
  function getNodeAt(mx, my) {
    // Check in reverse order so topmost drawn node is found first
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = mx - n.x;
      const dy = my - n.y;
      const hitRadius = 24; // generous hit area
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  }

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const node = getNodeAt(mouseX, mouseY);

    if (node) {
      canvas.style.cursor = 'pointer';
      hoveredNode = node;
      showTooltip(node, e.clientX, e.clientY);
    } else {
      canvas.style.cursor = 'default';
      hoveredNode = null;
      hideTooltip();
    }
  }

  function handleMouseLeave() {
    hoveredNode = null;
    hideTooltip();
    canvas.style.cursor = 'default';
  }

  // ─── Tooltip ───
  function showTooltip(node, clientX, clientY) {
    tooltipTitle.textContent = node.name;
    tooltipDesc.textContent = node.desc;

    // Build connections list
    const connIds = getConnectedNodeIds(node.id);
    const connNames = [...connIds].map(id => nodes[id].name);
    if (connNames.length > 0) {
      tooltipConns.innerHTML = 'Connected to: ' + connNames.map(n => `<span>${n}</span>`).join(', ');
    } else {
      tooltipConns.innerHTML = '';
    }

    // Position tooltip
    const containerRect = container.getBoundingClientRect();
    let tx = clientX - containerRect.left + 16;
    let ty = clientY - containerRect.top - 10;

    // Avoid overflow
    const tw = 320;
    if (tx + tw > containerRect.width) tx = clientX - containerRect.left - tw - 16;
    if (ty + 200 > containerRect.height) ty = containerRect.height - 210;
    if (ty < 10) ty = 10;

    tooltip.style.left = tx + 'px';
    tooltip.style.top = ty + 'px';
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // ─── Touch support ───
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    mouseX = touch.clientX - rect.left;
    mouseY = touch.clientY - rect.top;

    const node = getNodeAt(mouseX, mouseY);
    if (node) {
      hoveredNode = node;
      showTooltip(node, touch.clientX, touch.clientY);
    } else {
      hoveredNode = null;
      hideTooltip();
    }
  }

  // ─── Init ───
  function init() {
    resize();
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('resize', () => {
      resize();
    });
    requestAnimationFrame(draw);
  }

  init();
})();
