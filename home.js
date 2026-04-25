// === Home page scripts ===
(function(){
  'use strict';

  // Mobile nav toggle
  var hamburger = document.getElementById('nav-hamburger');
  var mobileNav = document.getElementById('nav-mobile');
  if(hamburger && mobileNav){
    hamburger.addEventListener('click',function(){
      mobileNav.classList.toggle('open');
    });
  }

  // Hero background animation — floating network dots
  var canvas = document.getElementById('hero-bg');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var dots = [];
  var W, H, dpr;

  function resize(){
    var rect = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function initDots(){
    dots = [];
    var count = Math.floor(W * H / 8000);
    count = Math.max(20, Math.min(count, 80));
    for(var i=0;i<count;i++){
      dots.push({
        x: Math.random()*W,
        y: Math.random()*H,
        vx: (Math.random()-0.5)*0.3,
        vy: (Math.random()-0.5)*0.3,
        r: 1.5 + Math.random()*1.5,
        alpha: 0.15 + Math.random()*0.25,
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // Move dots
    dots.forEach(function(d){
      d.x += d.vx; d.y += d.vy;
      if(d.x<0) d.x=W; if(d.x>W) d.x=0;
      if(d.y<0) d.y=H; if(d.y>H) d.y=0;
    });

    // Draw lines between nearby dots
    var maxDist = 120;
    for(var i=0;i<dots.length;i++){
      for(var j=i+1;j<dots.length;j++){
        var dx=dots[j].x-dots[i].x, dy=dots[j].y-dots[i].y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < maxDist){
          var alpha = (1 - dist/maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = 'rgba(6,182,212,'+alpha+')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    dots.forEach(function(d){
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(6,182,212,'+d.alpha+')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  initDots();
  requestAnimationFrame(draw);
  window.addEventListener('resize', function(){ resize(); initDots(); });
})();
