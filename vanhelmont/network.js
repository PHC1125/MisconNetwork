(function(){'use strict';
var nodes=[{"id": 0, "name": "Willow Tree Experiment", "desc": "The five-year controlled experiment in which van Helmont grew a willow shoot in measured soil, adding only water, then re-weighed both plant and soil."}, {"id": 1, "name": "Water as Sole Source", "desc": "Van Helmont's central conclusion: all 164 lbs of new plant matter originated entirely from water, with no other material contributing."}, {"id": 2, "name": "Controlled Experimental Design", "desc": "Methodological innovations \u2014 oven-dried soil, rain/distilled water only, tin cover to block dust \u2014 that gave the experiment credibility."}, {"id": 3, "name": "Soil Mass Unchanged", "desc": "The observed result that the soil lost only ~2 oz across five years, leading van Helmont to eliminate soil as the source of plant mass."}, {"id": 4, "name": "Dismissed 2-Ounce Discrepancy", "desc": "Van Helmont treated the small soil loss as experimental error rather than as evidence of real mineral uptake \u2014 the critical missed clue."}, {"id": 5, "name": "Ignorance of Atmospheric Gases", "desc": "In the 17th century, air was treated as a single element, not a mixture of distinct chemical species. The category of atmospheric input did not exist."}, {"id": 6, "name": "No Role for Air", "desc": "Because van Helmont lacked any concept of gases as distinct substances, he did not consider the atmosphere as a potential source of plant material."}, {"id": 7, "name": "No Role for Sunlight", "desc": "Light was not understood as an energy source capable of driving chemical reactions."}, {"id": 8, "name": "Quantitative Reasoning", "desc": "Van Helmont's use of precise weights before and after represents an early application of conservation-of-mass logic to biology."}, {"id": 9, "name": "Transmutation of Water", "desc": "Rooted in alchemical thinking, van Helmont believed the plant's archeus converted water directly into wood, bark, and root."}, {"id": 10, "name": "Plant as Passive Converter", "desc": "The plant is primarily a vessel that receives water and transforms it, with no active role attributed to light, air, or soil chemistry."}, {"id": 11, "name": "First Recorded Experiment", "desc": "The historical significance as the first attempt to answer a question about plant nutrition through controlled, quantitative observation."}, {"id": 12, "name": "Echo of Thales", "desc": "Van Helmont's conclusion revived \u2014 through empirical means \u2014 Thales' ancient claim that water is the fundamental substance of all matter."}, {"id": 13, "name": "Overlooked Carbon Dioxide", "desc": "The key source of plant carbon (atmospheric CO\u2082) was entirely absent from van Helmont's conceptual framework."}];
var edges=[[0, 1], [0, 2], [0, 3], [0, 4], [0, 11], [1, 6], [1, 7], [1, 9], [1, 10], [1, 12], [2, 3], [2, 4], [2, 8], [2, 11], [3, 4], [3, 8], [4, 5], [4, 13], [5, 6], [5, 7], [5, 13], [6, 7], [6, 13], [7, 10], [8, 3], [8, 11], [9, 1], [9, 10], [9, 12], [10, 7], [10, 12], [11, 0], [11, 8], [12, 1], [12, 9]];
var A1='#22C55E',A2='#4ADE80',GR='34, 197, 94',A2R='74, 222, 128';
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