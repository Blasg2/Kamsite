<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kamsite</title>
  <style>
    :root{
      --bg:#05070a;
      --fg:#eafff6;
      --muted:rgba(190,225,210,.7);
      --faint:rgba(150,180,168,.55);
      --fitc:#45f0b0;
      --dapi:#5cc8ff;
      --tritc:#ff6ec7;
    }
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;}
    body{
      font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
      color:var(--fg);
      background:radial-gradient(circle at 50% 36%, #0a1620 0%, #060a0e 56%, #04060a 100%);
      min-height:100vh;min-height:100dvh;
      display:flex;align-items:center;justify-content:center;
      padding:1.5rem;overflow:hidden;position:relative;
    }

    /* live fluorescence field */
    #scope{position:fixed;inset:0;width:100vw;height:100vh;display:block;z-index:0;}

    /* eyepiece vignette */
    .vignette{
      position:fixed;inset:0;z-index:1;pointer-events:none;
      background:radial-gradient(circle at 50% 42%,
        rgba(4,8,10,0) 38%, rgba(4,8,10,.5) 76%, rgba(3,5,8,.94) 100%);
    }

    /* viewfinder corner brackets */
    .frame{position:fixed;inset:16px;z-index:3;pointer-events:none;}
    .frame span{position:absolute;width:26px;height:26px;border:1.5px solid rgba(69,240,176,.32);}
    .frame .ftl{top:0;left:0;border-right:0;border-bottom:0;}
    .frame .ftr{top:0;right:0;border-left:0;border-bottom:0;}
    .frame .fbl{bottom:0;left:0;border-right:0;border-top:0;}
    .frame .fbr{bottom:0;right:0;border-left:0;border-top:0;}

    /* instrument HUD */
    .hud{
      position:fixed;z-index:3;pointer-events:none;
      font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      font-size:11px;letter-spacing:.13em;text-transform:uppercase;
      color:rgba(190,225,210,.58);line-height:1.85;
    }
    .hud-tl{top:30px;left:30px;}
    .hud-tr{top:30px;right:30px;text-align:right;}
    .hud-bl{bottom:30px;left:30px;}
    .hud-br{bottom:30px;right:30px;text-align:right;}
    .ch{display:flex;align-items:center;gap:9px;}
    .dot{width:7px;height:7px;border-radius:50%;flex:0 0 auto;}
    .d1{background:var(--fitc);box-shadow:0 0 8px var(--fitc);}
    .d2{background:var(--dapi);box-shadow:0 0 8px var(--dapi);}
    .d3{background:var(--tritc);box-shadow:0 0 8px var(--tritc);}
    .scale{display:flex;align-items:center;gap:10px;}
    .bar{width:64px;height:3px;border-radius:2px;background:rgba(190,225,210,.7);box-shadow:0 0 6px rgba(190,225,210,.45);}
    .rec{display:flex;align-items:center;gap:8px;justify-content:flex-end;margin-top:3px;}
    .blink{width:7px;height:7px;border-radius:50%;background:var(--fitc);box-shadow:0 0 8px var(--fitc);animation:blink 1.6s infinite;}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

    /* specimen label / content */
    main{
      position:relative;z-index:4;max-width:36rem;width:100%;
      padding:2.5rem 2rem 2.6rem;border-radius:1.1rem;
      background:rgba(6,14,12,.34);
      border:1px solid rgba(69,240,176,.14);
      backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);
      box-shadow:0 0 60px rgba(69,240,176,.08), inset 0 0 30px rgba(69,240,176,.04);
      text-align:center;
    }
    .eyebrow{
      font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      font-size:11px;letter-spacing:.34em;text-transform:uppercase;
      color:rgba(69,240,176,.78);margin-bottom:1.05rem;
    }
    h1{
      font-size:clamp(2.6rem,9vw,4.4rem);font-weight:700;
      letter-spacing:-.02em;color:#eafff6;margin-bottom:.7rem;
      animation:glow 4.5s ease-in-out infinite;
    }
    @keyframes glow{
      0%,100%{text-shadow:0 0 18px rgba(69,240,176,.45),0 0 50px rgba(69,240,176,.22);}
      50%{text-shadow:0 0 26px rgba(69,240,176,.62),0 0 72px rgba(69,240,176,.34);}
    }
    .tagline{color:var(--muted);font-size:1.08rem;line-height:1.6;margin-bottom:2.2rem;}
    .play-button{
      display:inline-flex;align-items:center;gap:.55rem;
      font-size:1.1rem;font-weight:600;text-decoration:none;color:#04120d;
      background:linear-gradient(135deg,#5cffc0,#45f0b0);
      padding:.95rem 2.6rem;border-radius:.7rem;
      box-shadow:0 8px 34px rgba(69,240,176,.4), inset 0 0 0 1px rgba(120,255,210,.5);
      transition:transform .15s ease, box-shadow .2s ease, filter .2s ease;
    }
    .play-button:hover{
      transform:translateY(-2px);filter:brightness(1.06);
      box-shadow:0 12px 46px rgba(69,240,176,.56), inset 0 0 0 1px rgba(160,255,225,.7);
    }
    .play-button:active{transform:translateY(0);}
    .hint{margin-top:1.8rem;color:var(--faint);font-size:.85rem;letter-spacing:.02em;}

    @media (max-width:560px){
      .hud{font-size:10px;}
      .hud-tl,.hud-bl{left:16px;}
      .hud-tr,.hud-br{right:16px;}
      .hud-tl,.hud-tr{top:18px;}
      .hud-bl,.hud-br{bottom:18px;}
      .frame{inset:11px;}
      main{padding:2rem 1.4rem 2.2rem;}
      .obj-sub{display:none;}
    }
    @media (prefers-reduced-motion: reduce){
      h1{animation:none;}
      .blink{animation:none;}
    }
  </style>
</head>
<body>
  <canvas id="scope"></canvas>
  <div class="vignette"></div>

  <div class="hud hud-tl">
    <div class="ch"><span class="dot d1"></span>FITC · 488</div>
    <div class="ch"><span class="dot d2"></span>DAPI · 405</div>
    <div class="ch"><span class="dot d3"></span>TRITC · 561</div>
  </div>
  <div class="hud hud-tr">
    PLAN APO 63× / 1.40 OIL
    <div class="obj-sub">KAMSITE IMAGING LAB</div>
  </div>
  <div class="hud hud-bl">
    <div class="scale"><span class="bar"></span>50 µm</div>
  </div>
  <div class="hud hud-br">
    SAMPLE KS-001 · FIELD 04
    <div class="rec"><span class="blink"></span>LIVE</div>
  </div>

  <div class="frame"><span class="ftl"></span><span class="ftr"></span><span class="fbl"></span><span class="fbr"></span></div>

  <main>
    <div class="eyebrow">CULTURA VIVA · KS-001</div>
    <h1>Kamsite</h1>
    <p class="tagline">Seu portal para novidades Kams.</p>
    <a class="play-button" href="https://play.kamsite.uk/index.html">▶ Kamsimulator</a>
    <p class="hint">Viva um dia como K.S</p>
  </main>

  <script>
    (function(){
      var canvas=document.getElementById('scope');
      var ctx=canvas.getContext('2d');
      var W=0,H=0,DPR=1;
      var cells=[],microbes=[];
      var mouse={x:-9999,y:-9999,active:false};
      var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var CH=[
        {r:69,g:240,b:176},
        {r:92,g:200,b:255},
        {r:255,g:110,b:199}
      ];

      function rand(a,b){return a+Math.random()*(b-a);}
      function rgba(c,a){return 'rgba('+c.r+','+c.g+','+c.b+','+a+')';}

      function resize(){
        DPR=Math.min(window.devicePixelRatio||1,2);
        W=window.innerWidth;H=window.innerHeight;
        canvas.width=Math.floor(W*DPR);
        canvas.height=Math.floor(H*DPR);
        ctx.setTransform(DPR,0,0,DPR,0,0);
      }

      function makeCell(){
        var c=CH[Math.floor(Math.random()*CH.length)];
        return {
          x:rand(0,W),y:rand(0,H),
          vx:rand(-0.12,0.12),vy:rand(-0.12,0.12),
          r:rand(45,110),col:c,
          phase:rand(0,Math.PI*2),pspeed:rand(0.004,0.012),
          nx:rand(-0.25,0.25),ny:rand(-0.25,0.25),nr:rand(0.18,0.32)
        };
      }
      function makeMicrobe(){
        var c=CH[Math.floor(Math.random()*CH.length)];
        return {
          x:rand(0,W),y:rand(0,H),
          vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),
          r:rand(1.2,3.2),col:c,t:rand(0,1000)
        };
      }

      function init(){
        resize();
        cells=[];microbes=[];
        var n=Math.round(Math.min(22,Math.max(10,(W*H)/90000)));
        for(var i=0;i<n;i++)cells.push(makeCell());
        var m=Math.round(Math.min(60,Math.max(24,(W*H)/30000)));
        for(var j=0;j<m;j++)microbes.push(makeMicrobe());
      }

      function drawCell(o){
        var pr=o.r*(1+0.06*Math.sin(o.phase));
        var g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,pr);
        g.addColorStop(0,rgba(o.col,0.55));
        g.addColorStop(0.45,rgba(o.col,0.18));
        g.addColorStop(1,rgba(o.col,0));
        ctx.fillStyle=g;
        ctx.beginPath();ctx.arc(o.x,o.y,pr,0,Math.PI*2);ctx.fill();

        ctx.lineWidth=2;
        ctx.strokeStyle=rgba(o.col,0.5);
        ctx.beginPath();ctx.arc(o.x,o.y,pr*0.82,0,Math.PI*2);ctx.stroke();

        var nxp=o.x+o.nx*pr, nyp=o.y+o.ny*pr, nrp=pr*o.nr;
        var ng=ctx.createRadialGradient(nxp,nyp,0,nxp,nyp,nrp);
        ng.addColorStop(0,rgba(o.col,0.9));
        ng.addColorStop(0.6,rgba(o.col,0.4));
        ng.addColorStop(1,rgba(o.col,0));
        ctx.fillStyle=ng;
        ctx.beginPath();ctx.arc(nxp,nyp,nrp,0,Math.PI*2);ctx.fill();
      }

      function step(o,pad){
        if(mouse.active){
          var dx=o.x-mouse.x, dy=o.y-mouse.y;
          var d2=dx*dx+dy*dy, R=180;
          if(d2<R*R){
            var d=Math.sqrt(d2)||1;
            var f=(1-d/R);
            o.vx+=(dx/d)*f*0.10;
            o.vy+=(dy/d)*f*0.10;
          }
        }
        o.x+=o.vx;o.y+=o.vy;
        o.vx*=0.99;o.vy*=0.99;
        if(o.x<-pad)o.x=W+pad;
        if(o.x>W+pad)o.x=-pad;
        if(o.y<-pad)o.y=H+pad;
        if(o.y>H+pad)o.y=-pad;
      }

      function frame(){
        ctx.clearRect(0,0,W,H);
        ctx.globalCompositeOperation='lighter';
        var i;
        for(i=0;i<cells.length;i++){
          var c=cells[i];
          c.phase+=c.pspeed;
          step(c,c.r);
          drawCell(c);
        }
        for(i=0;i<microbes.length;i++){
          var m=microbes[i];
          m.t+=1;
          m.vx+=rand(-0.08,0.08);m.vy+=rand(-0.08,0.08);
          m.vx*=0.9;m.vy*=0.9;
          step(m,6);
          var a=0.5+0.3*Math.sin(m.t*0.05);
          var mg=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,m.r*4);
          mg.addColorStop(0,rgba(m.col,a));
          mg.addColorStop(1,rgba(m.col,0));
          ctx.fillStyle=mg;
          ctx.beginPath();ctx.arc(m.x,m.y,m.r*4,0,Math.PI*2);ctx.fill();
        }
        if(mouse.active){
          var sg=ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,160);
          sg.addColorStop(0,'rgba(120,255,210,0.10)');
          sg.addColorStop(1,'rgba(120,255,210,0)');
          ctx.fillStyle=sg;
          ctx.beginPath();ctx.arc(mouse.x,mouse.y,160,0,Math.PI*2);ctx.fill();
        }
        ctx.globalCompositeOperation='source-over';
        if(!reduce)requestAnimationFrame(frame);
      }

      window.addEventListener('resize',function(){resize();if(reduce)frame();});
      window.addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});
      window.addEventListener('pointerleave',function(){mouse.active=false;mouse.x=-9999;mouse.y=-9999;});
      window.addEventListener('pointerdown',function(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});

      init();
      frame();
    })();
  </script>
</body>
</html>
