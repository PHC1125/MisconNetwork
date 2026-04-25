(function(){'use strict';
var nodes=[{"id": 0, "name": "Salts as Plant Food", "desc": "The primary claim: salts (alkaline mineral substances) are the essential material that plants extract from soil to build their bodies."}, {"id": 1, "name": "Every Plant Contains Salt", "desc": "All plants, without exception, incorporate salt into their tissues; this is universal and detectable."}, {"id": 2, "name": "Plant Ash Reveals Composition", "desc": "Burning a plant to ash exposes its true mineral substance; the consistently salty residue is chemical evidence of what the plant contained."}, {"id": 3, "name": "Manure Restores Fertility", "desc": "Applying dung to a field restores its productivity because dung contains the salts that previous crops removed."}, {"id": 4, "name": "Soil Depletion by Cropping", "desc": "Repeated harvesting removes salts from the soil, progressively reducing fertility until they are replenished."}, {"id": 5, "name": "Nutrient Cycling", "desc": "The closed loop: salts pass from soil into plant, can be recovered as ash, and returned to soil to restore what was taken."}, {"id": 6, "name": "Soil as Sole Source", "desc": "All meaningful plant substance originates in the soil; water, air, and light are not recognised as contributors to mass."}, {"id": 7, "name": "Practical Observation", "desc": "Palissy's method: trust empirical craft knowledge and direct agricultural observation rather than ancient philosophical authority."}, {"id": 8, "name": "Roots as Sole Uptake Organ", "desc": "Plants acquire all nutritive substances via root uptake from the soil solution; no nutritive input occurs above ground."}, {"id": 9, "name": "Burning Reveals True Substance", "desc": "Fire strips away the inessential and leaves only the core mineral matter; what survives combustion is what the plant truly is."}, {"id": 10, "name": "Exclusion of Water as Food", "desc": "Water is recognised as a transport medium for salts, but not as a substance incorporated into plant mass."}, {"id": 11, "name": "Exclusion of Air", "desc": "The gaseous environment contributes nothing to plant substance; carbon, oxygen, and nitrogen from air play no role."}, {"id": 12, "name": "Salts Explain Diversity", "desc": "Differences between plant species can be attributed to differences in the kinds and amounts of salt they extract from the soil."}, {"id": 13, "name": "Conservation of Soil Substances", "desc": "Soil substances are finite and conserved; farming is management of a limited stock, not creation of new matter."}, {"id": 14, "name": "Exclusion of Sunlight", "desc": "Solar energy is not recognised as driving growth or building plant mass; plants grow by accumulating chemical substance."}];
var edges=[[0, 1], [0, 2], [0, 3], [0, 4], [0, 12], [1, 2], [1, 12], [2, 5], [2, 9], [3, 4], [3, 5], [3, 13], [4, 3], [4, 5], [4, 13], [5, 2], [5, 6], [5, 13], [6, 0], [6, 8], [6, 10], [6, 11], [6, 14], [7, 0], [7, 2], [7, 3], [7, 4], [7, 9], [8, 6], [8, 10], [8, 11], [9, 2], [9, 7], [10, 6], [10, 11], [11, 10], [11, 14], [12, 0], [12, 1], [13, 4], [13, 5], [13, 8], [14, 6], [14, 11]];
var A1='#F59E0B',A2='#FBBF24',GR='245, 158, 11',A2R='251, 191, 36';
var canvas=document.getElementById('network-canvas'),ctx=canvas.getContext('2d'),
container=document.getElementById('canvas-container'),
tooltip=document.getElementById('tooltip'),
tooltipTitle=document.getElementById('tooltip-title'),
tooltipDesc=document.getElementById('tooltip-desc'),
tooltipConns=document.getElementById('tooltip-connections');
var W,H,dpr,hoveredNode=null,mouseX=0,mouseY=0,animTime=0;

function resize(){var r=container.getBoundingClientRect();dpr=window.devicePixelRatio||1;W=r.width;H=r.height;
canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';
ctx.setTransform(dpr,0,0,dpr,0,0);layoutNodes()}

function layoutNodes(){var cx=W/2,cy=H/2,rx=Math.min(W,900)*0.38,ry=Math.min(H,700)*0.38;
nodes.forEach(function(n,i){var a=(i/nodes.length)*Math.PI*2-Math.PI/2,rv=0.85+Math.sin(i*2.7)*0.15;
n.x=cx+Math.cos(a)*rx*rv;n.y=cy+Math.sin(a)*ry*rv;n.vx=0;n.vy=0});
for(var iter=0;iter<300;iter++){var alpha=1-iter/300;
for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){
var dx=nodes[j].x-nodes[i].x,dy=nodes[j].y-nodes[i].y,d=Math.sqrt(dx*dx+dy*dy)||1,
rs=W<500?18000:12000,f=rs/(d*d),fx=dx/d*f,fy=dy/d*f;
nodes[i].vx-=fx;nodes[i].vy-=fy;nodes[j].vx+=fx;nodes[j].vy+=fy}
edges.forEach(function(e){var dx=nodes[e[1]].x-nodes[e[0]].x,dy=nodes[e[1]].y-nodes[e[0]].y,
d=Math.sqrt(dx*dx+dy*dy)||1,id=Math.min(W,H)*0.18,f=(d-id)*0.005,fx=dx/d*f,fy=dy/d*f;
nodes[e[0]].vx+=fx;nodes[e[0]].vy+=fy;nodes[e[1]].vx-=fx;nodes[e[1]].vy-=fy});
nodes.forEach(function(n){n.vx+=(cx-n.x)*0.002;n.vy+=(cy-n.y)*0.002;
n.vx*=0.85;n.vy*=0.85;n.x+=n.vx*alpha;n.y+=n.vy*alpha;
var p=60;n.x=Math.max(p,Math.min(W-p,n.x));n.y=Math.max(p,Math.min(H-p,n.y))})}}

function getConnectedNodeIds(nid){var s=new Set();edges.forEach(function(e){if(e[0]===nid)s.add(e[1]);if(e[1]===nid)s.add(e[0])});return s}

function draw(){animTime+=0.015;ctx.clearRect(0,0,W,H);
var cIds=hoveredNode!==null?getConnectedNodeIds(hoveredNode.id):new Set(),isH=hoveredNode!==null;
edges.forEach(function(e){var na=nodes[e[0]],nb=nodes[e[1]],hl=isH&&(e[0]===hoveredNode.id||e[1]===hoveredNode.id),dm=isH&&!hl;
ctx.beginPath();ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);
if(hl){ctx.strokeStyle='rgba('+GR+',0.8)';ctx.lineWidth=2.5;ctx.shadowColor='rgba('+GR+',0.5)';ctx.shadowBlur=12}
else if(dm){ctx.strokeStyle='rgba('+GR+',0.06)';ctx.lineWidth=1;ctx.shadowColor='transparent';ctx.shadowBlur=0}
else{ctx.strokeStyle='rgba('+GR+',0.18)';ctx.lineWidth=1;ctx.shadowColor='transparent';ctx.shadowBlur=0}
ctx.stroke();ctx.shadowBlur=0});

nodes.forEach(function(n){var isA=isH&&hoveredNode.id===n.id,isC=isH&&cIds.has(n.id),isDm=isH&&!isA&&!isC;
var br=isA?18:isC?13:10,pr=isA?br+Math.sin(animTime*3)*2:br;
if(isA||isC){var gg=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,pr*3);
gg.addColorStop(0,isA?'rgba('+GR+',0.35)':'rgba('+A2R+',0.2)');gg.addColorStop(1,'rgba('+GR+',0)');
ctx.beginPath();ctx.arc(n.x,n.y,pr*3,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill()}
var g=ctx.createRadialGradient(n.x-pr*0.3,n.y-pr*0.3,0,n.x,n.y,pr);
if(isDm){g.addColorStop(0,'rgba(60,60,80,0.5)');g.addColorStop(1,'rgba(30,30,50,0.3)')}
else{g.addColorStop(0,isA?A1:isC?A1:'rgba('+GR+',0.7)');g.addColorStop(1,isA?A2:isC?A2:'rgba('+GR+',0.4)')}
ctx.beginPath();ctx.arc(n.x,n.y,pr,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
if(!isDm){ctx.strokeStyle=isA?'rgba(255,255,255,0.6)':'rgba('+GR+',0.4)';ctx.lineWidth=isA?2:1;ctx.stroke()}

var la=isDm?0.2:isA?1:isC?0.9:0.7;
ctx.fillStyle='rgba(240,244,248,'+la+')';ctx.font=(isA?'bold ':'')+(isA?'13px':'11px')+' "Didact Gothic",sans-serif';
ctx.textAlign='center';ctx.textBaseline='top';
var lbl=n.name,mw=isA?150:110,ws=lbl.split(' '),ls=[],cl=ws[0];
for(var i=1;i<ws.length;i++){var tl=cl+' '+ws[i];if(ctx.measureText(tl).width>mw){ls.push(cl);cl=ws[i]}else cl=tl}ls.push(cl);
var lh=isA?15:13,ly=n.y+pr+6;ls.forEach(function(l,li){ctx.fillText(l,n.x,ly+li*lh)})});
requestAnimationFrame(draw)}

function getNodeAt(mx,my){for(var i=nodes.length-1;i>=0;i--){var n=nodes[i],dx=mx-n.x,dy=my-n.y;if(dx*dx+dy*dy<=576)return n}return null}

function showTooltip(node,cx,cy){tooltipTitle.textContent=node.name;tooltipDesc.textContent=node.desc;
var ci=getConnectedNodeIds(node.id),cn=[...ci].map(function(id){return nodes[id].name});
tooltipConns.innerHTML=cn.length?'Connected to: '+cn.map(function(n){return '<span>'+n+'</span>'}).join(', '):'';
var cr=container.getBoundingClientRect(),tx=cx-cr.left+16,ty=cy-cr.top-10;
if(tx+320>cr.width)tx=cx-cr.left-336;if(ty+200>cr.height)ty=cr.height-210;if(ty<10)ty=10;
tooltip.style.left=tx+'px';tooltip.style.top=ty+'px';tooltip.classList.add('visible')}
function hideTooltip(){tooltip.classList.remove('visible')}

canvas.addEventListener('mousemove',function(e){var r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;
var nd=getNodeAt(mouseX,mouseY);if(nd){canvas.style.cursor='pointer';hoveredNode=nd;showTooltip(nd,e.clientX,e.clientY)}
else{canvas.style.cursor='default';hoveredNode=null;hideTooltip()}});
canvas.addEventListener('mouseleave',function(){hoveredNode=null;hideTooltip();canvas.style.cursor='default'});
canvas.addEventListener('touchstart',function(e){e.preventDefault();var t=e.touches[0],r=canvas.getBoundingClientRect();
mouseX=t.clientX-r.left;mouseY=t.clientY-r.top;var nd=getNodeAt(mouseX,mouseY);
if(nd){hoveredNode=nd;showTooltip(nd,t.clientX,t.clientY)}else{hoveredNode=null;hideTooltip()}},{passive:false});

function init(){resize();window.addEventListener('resize',resize);requestAnimationFrame(draw)}
init()})();