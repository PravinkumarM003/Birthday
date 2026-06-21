/* ========================================================
   ULTRA-PREMIUM BIRTHDAY WEBSITE â€” SCRIPT.JS
   Modern ES6+ Architecture | Production Ready
   ======================================================== */

'use strict';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  1. UTILITY HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));
const delay = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  2. STATE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const State = {
  currentSection: 1,
  musicPlaying: false,
  candlesBlown: 0,
  totalCandles: 5,
  cakeCut: false,
  giftsOpened: 0,
  totalGifts: 4,
  achievements: new Set(),
  easterEggClicks: 0,
  mouseX: 0,
  mouseY: 0,
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  3. DOM REFERENCES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const bgCanvas = $('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
const auroraLayer = $('auroraLayer');
const cursorGlow = $('cursorGlow');
const cursorTrailCont = $('cursorTrailContainer');
const particleLayer = $('particleLayer');
const firefliesLayer = $('firefliesLayer');
const musicBtn = $('musicBtn');
const musicIcon = $('musicIcon');
const bgMusic = $('bgMusic');
const secretBtn = $('secretBtn');
const achieveToast = $('achievementToast');
const achieveTitle = $('achievementTitle');
const achieveDesc = $('achievementDesc');
const achieveIcon = $('achievementIcon');
const countdownOverlay = $('countdownOverlay');
const countdownNumber = $('countdownNumber');

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  4. CANVAS RESIZE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  5. BACKGROUND PARTICLE SYSTEM (Depth Field)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BG_PARTICLES = [];
const BP_COUNT = 200;

class BgParticle {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = rand(0, bgCanvas.width);
    this.y = initial ? rand(0, bgCanvas.height) : bgCanvas.height + 10;
    this.z = rand(0.1, 1); // depth
    this.r = this.z * 2.2;
    this.speed = this.z * 0.4;
    this.alpha = this.z * 0.7;
    this.hue = randInt(280, 360);
    this.drift = rand(-0.3, 0.3);
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift + (State.mouseX / window.innerWidth - 0.5) * this.z * 0.5;
    if (this.y < -10) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 80%, 75%)`;
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < BP_COUNT; i++) BG_PARTICLES.push(new BgParticle());

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  6. FIREWORKS ENGINE (Section 4)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let finaleCanvas, finaleCtx;
const ROCKETS = [];
const FW_SPARKS = [];

class Rocket {
  constructor(grand = false) {
    this.x = rand(window.innerWidth * .15, window.innerWidth * .85);
    this.y = window.innerHeight + 5;
    this.tx = rand(window.innerWidth * .1, window.innerWidth * .9);
    this.ty = rand(grand ? 50 : window.innerHeight * .15, window.innerHeight * .5);
    this.speed = rand(grand ? 14 : 10, grand ? 20 : 15);
    this.color = `hsl(${randInt(0, 360)},100%,60%)`;
    this.trail = [];
    this.alive = true;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();
    const dx = this.tx - this.x, dy = this.ty - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist < this.speed) {
      this.alive = false;
      explode(this.x, this.y, this.color);
      return;
    }
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
  }
  draw(ctx) {
    ctx.save();
    this.trail.forEach((t, i) => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, (i / this.trail.length) * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = (i / this.trail.length) * 0.6;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.restore();
  }
}

class FWSpark {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    const a = rand(0, Math.PI * 2);
    const spd = rand(1, 8);
    this.vx = Math.cos(a) * spd;
    this.vy = Math.sin(a) * spd;
    this.color = color;
    this.alpha = 1;
    this.decay = rand(0.012, 0.025);
    this.r = rand(1, 3);
    this.heart = Math.random() < 0.15;
  }
  update() {
    this.vx *= 0.96; this.vy *= 0.96;
    this.vy += 0.12;
    this.x += this.vx; this.y += this.vy;
    this.alpha -= this.decay;
  }
  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.heart) {
      ctx.font = `${this.r * 6}px serif`;
      ctx.fillText('â¤', this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
    ctx.restore();
  }
}

function explode(x, y, color) {
  const count = randInt(60, 100);
  for (let i = 0; i < count; i++) FW_SPARKS.push(new FWSpark(x, y, color));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  7. CONFETTI ENGINE (3D style)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CONFETTI = [];
const CONFETTI_COLORS = ['#ff4da6', '#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#f472b6'];

class Confetto {
  constructor() {
    this.x = rand(0, window.innerWidth);
    this.y = rand(-window.innerHeight, 0);
    this.w = rand(6, 14); this.h = rand(4, 9);
    this.color = CONFETTI_COLORS[randInt(0, CONFETTI_COLORS.length)];
    this.vx = rand(-2, 2); this.vy = rand(2, 6);
    this.rot = rand(0, Math.PI * 2);
    this.rotV = rand(-.08, .08);
    this.alpha = rand(.6, 1);
    this.flip = 0; this.flipV = rand(.02, .08);
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vx += rand(-.05, .05);
    this.rot += this.rotV; this.flip += this.flipV;
    if (this.y > window.innerHeight + 20) {
      this.x = rand(0, window.innerWidth);
      this.y = -20;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.scale(Math.cos(this.flip), 1);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  }
}

function spawnConfetti(count = 300) {
  for (let i = 0; i < count; i++) CONFETTI.push(new Confetto());
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  8. BACKGROUND RENDER LOOP
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  BG_PARTICLES.forEach(p => { p.update(); p.draw(bgCtx); });
  requestAnimationFrame(renderBg);
}
renderBg();

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  9. FINALE RENDER LOOP (started later)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let finaleRunning = false;
let grandInterval;

function renderFinale() {
  if (!finaleRunning) return;
  finaleCtx.clearRect(0, 0, finaleCanvas.width, finaleCanvas.height);

  // Update & draw rockets
  for (let i = ROCKETS.length - 1; i >= 0; i--) {
    ROCKETS[i].update();
    if (!ROCKETS[i].alive) ROCKETS.splice(i, 1);
    else ROCKETS[i].draw(finaleCtx);
  }
  // Update & draw sparks
  for (let i = FW_SPARKS.length - 1; i >= 0; i--) {
    FW_SPARKS[i].update();
    if (FW_SPARKS[i].alpha <= 0) FW_SPARKS.splice(i, 1);
    else FW_SPARKS[i].draw(finaleCtx);
  }
  // Draw confetti on finale canvas
  CONFETTI.forEach(c => { c.update(); c.draw(finaleCtx); });

  requestAnimationFrame(renderFinale);
}

function startFinale() {
  finaleCanvas = $('finaleCanvas');
  finaleCanvas.width = window.innerWidth;
  finaleCanvas.height = window.innerHeight;
  finaleCtx = finaleCanvas.getContext('2d');

  finaleRunning = true;
  spawnConfetti(400);
  renderFinale();

  // Spawn rockets continuously
  grandInterval = setInterval(() => {
    if (ROCKETS.length < 12) ROCKETS.push(new Rocket(true));
  }, 200);

  // Stars text animation
  drawStarsText('Happy Birthday Brindha');

  // Typing finale title
  typeWriter($('finaleTitle'), 'Have a Wonderful Birthday, Brindha!', 65);

  // Spawn lanterns
  const lanternsFinale = $('lanternsFinale');
  const lcolors = ['#fbbf24', '#f97316', '#f472b6', '#818cf8', '#34d399'];
  for (let i = 0; i < 20; i++) {
    setTimeout(() => spawnLantern(lanternsFinale, lcolors[i % lcolors.length]), i * 600);
  }
}

// ──────────────────────────────────────────────────
//  10. STARS TEXT CANVAS
// ──────────────────────────────────────────────────
function drawStarsText(text) {
  const stCanvas = $('starsTextCanvas');
  stCanvas.width = window.innerWidth;
  stCanvas.height = window.innerHeight;
  const stCtx = stCanvas.getContext('2d');

  // Draw text offscreen to sample pixel positions
  const tmp = document.createElement('canvas');
  tmp.width = stCanvas.width; tmp.height = 120;
  const tc = tmp.getContext('2d');
  tc.fillStyle = '#fff';
  tc.font = `bold ${clamp(window.innerWidth / 14, 30, 80)}px Cormorant Garamond, serif`;
  tc.textAlign = 'center';
  tc.textBaseline = 'middle';
  tc.fillText(text, tmp.width / 2, 60);
  const data = tc.getImageData(0, 0, tmp.width, 120).data;

  const dots = [];
  const step = 6;
  for (let y = 0; y < 120; y += step) {
    for (let x = 0; x < tmp.width; x += step) {
      const idx = (y * tmp.width + x) * 4;
      if (data[idx + 3] > 128) {
        dots.push({
          tx: x, ty: y + (window.innerHeight * .12),
          x: rand(0, stCanvas.width),
          y: rand(0, stCanvas.height),
          alpha: 0,
        });
      }
    }
  }

  let frame = 0;
  const FRAMES = 90;
  function animFrame() {
    stCtx.clearRect(0, 0, stCanvas.width, stCanvas.height);
    frame++;
    const t = Math.min(frame / FRAMES, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    dots.forEach(d => {
      const cx = d.x + (d.tx - d.x) * ease;
      const cy = d.y + (d.ty - d.y) * ease;
      d.alpha = Math.min(d.alpha + 0.04, 1);
      stCtx.save();
      stCtx.globalAlpha = d.alpha;
      stCtx.beginPath();
      stCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      stCtx.fillStyle = `hsl(${(frame * 2 + cx) % 360}, 90%, 70%)`;
      stCtx.fill();
      stCtx.restore();
    });
    if (frame < FRAMES + 30) requestAnimationFrame(animFrame);
  }
  requestAnimationFrame(animFrame);
}

// ──────────────────────────────────────────────────
//  11. CUSTOM CURSOR
// ──────────────────────────────────────────────────
const TRAIL_DOTS = 12;
const trailDots = [];

for (let i = 0; i < TRAIL_DOTS; i++) {
  const d = document.createElement('div');
  d.className = 'cursor-trail-dot';
  const size = (1 - i / TRAIL_DOTS) * 8 + 2;
  d.style.width = size + 'px';
  d.style.height = size + 'px';
  d.style.opacity = (1 - i / TRAIL_DOTS) * 0.6;
  cursorTrailCont.appendChild(d);
  trailDots.push({ el: d, x: 0, y: 0 });
}

let mousePositions = [];

window.addEventListener('mousemove', e => {
  State.mouseX = e.clientX;
  State.mouseY = e.clientY;
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  mousePositions.unshift({ x: e.clientX, y: e.clientY });
  if (mousePositions.length > TRAIL_DOTS) mousePositions.length = TRAIL_DOTS;
  trailDots.forEach((d, i) => {
    const pos = mousePositions[i] || mousePositions[mousePositions.length - 1];
    if (pos) {
      d.el.style.left = pos.x + 'px';
      d.el.style.top = pos.y + 'px';
    }
  });
});

// ──────────────────────────────────────────────────
//  12. SECTION TRANSITION
// ──────────────────────────────────────────────────
function goToSection(num) {
  const from = $(`section${State.currentSection}`);
  const to = $(`section${num}`);
  if (!from || !to || from === to) return;

  from.style.opacity = 0;
  from.style.transform = 'scale(0.95)';
  from.style.transition = 'opacity .8s ease, transform .8s ease';
  setTimeout(() => {
    from.classList.remove('active');
    from.style.transform = '';
    to.classList.add('active');
    to.style.opacity = 0;
    to.style.transform = 'scale(1.04)';
    to.style.transition = 'opacity .8s ease, transform .8s ease';
    requestAnimationFrame(() => {
      to.style.opacity = 1;
      to.style.transform = 'scale(1)';
    });
    State.currentSection = num;
    if (num === 4) startFinale();
  }, 800);
}

// ──────────────────────────────────────────────────
//  13. FLOATING ELEMENTS — INTRO
// ──────────────────────────────────────────────────
function buildIntroEnvironment() {
  buildStars();
  buildShootingStars();
  buildFireflies();
  buildClouds();
  buildBalloons();
  buildLanterns($('lanternsIntro'));
}

// ──────────────────────────────────────────────────
// Stars field
function buildStars() {
  const field = $('starsField');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = rand(.5, 3.5);
    s.style.cssText = `
      left:${rand(0, 100)}vw; top:${rand(0, 100)}vh;
      width:${size}px; height:${size}px;
      animation-duration:${rand(1.5, 4)}s;
      animation-delay:${rand(0, 3)}s;
    `;
    s.addEventListener('click', () => starClick(s));
    field.appendChild(s);
  }
}

function starClick(el) {
  el.style.transform = 'scale(4)';
  el.style.filter = 'drop-shadow(0 0 12px #fde68a)';
  spawnMiniExplosion(parseFloat(el.style.left), parseFloat(el.style.top));
  setTimeout(() => { el.style.transform = ''; el.style.filter = ''; }, 500);
  if (!State.achievements.has('star')) {
    showAchievement('⭐', 'Star Gazer!', 'You clicked a floating star');
    State.achievements.add('star');
  }
}

// ──────────────────────────────────────────────────
// Shooting stars
function buildShootingStars() {
  const cont = $('shootingStars');
  function spawnShoot() {
    const s = document.createElement('div');
    s.className = 'shoot';
    s.style.cssText = `
      top:${rand(0, 50)}vh; left:${rand(0, 50)}vw;
      animation-duration:${rand(1, 2.5)}s;
    `;
    cont.appendChild(s);
    setTimeout(() => s.remove(), 2500);
  }
  setInterval(spawnShoot, 3000);
  spawnShoot();
}

// ──────────────────────────────────────────────────
// Fireflies
function buildFireflies() {
  for (let i = 0; i < 25; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.cssText = `
      left:${rand(0, 100)}vw; top:${rand(0, 100)}vh;
      animation-duration:${rand(4, 9)}s;
      animation-delay:${rand(0, 6)}s;
    `;
    firefliesLayer.appendChild(f);
  }
}

// ──────────────────────────────────────────────────
// Clouds
function buildClouds() {
  const field = $('cloudsField');
  for (let i = 0; i < 6; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = rand(120, 300), h = rand(40, 80);
    c.style.cssText = `
      width:${w}px; height:${h}px;
      top:${rand(5, 70)}vh;
      animation-duration:${rand(50, 120)}s;
      animation-delay:${rand(-80, 0)}s;
    `;
    field.appendChild(c);
  }
}

// ──────────────────────────────────────────────────
// Balloons
function buildBalloons() {
  const field = $('balloonsField');
  const colors = ['#ff4da6', '#a78bfa', '#34d399', '#fbbf24', '#60a5fa', '#fb923c'];
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div');
    b.className = 'balloon-el';
    b.style.cssText = `
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.5), ${colors[i % colors.length]});
      left:${rand(2, 95)}vw;
      animation-duration:${rand(6, 11)}s;
      animation-delay:${rand(0, 5)}s;
    `;
    b.addEventListener('click', () => popBalloon(b));
    field.appendChild(b);
  }
}

function popBalloon(el) {
  el.style.transform = 'scale(0)';
  el.style.opacity = '0';
  el.style.transition = 'transform .3s, opacity .3s';
  spawnMiniExplosion(
    parseFloat(el.style.left),
    100 - rand(10, 80)
  );
  setTimeout(() => el.remove(), 400);
  if (!State.achievements.has('balloon')) {
    showAchievement('Balloon', 'Pop Star!', 'You popped a balloon');
    State.achievements.add('balloon');
  }
}

// ──────────────────────────────────────────────────
// Lanterns
function buildLanterns(container) {
  const colors = ['#fbbf24', '#f97316', '#f472b6', '#818cf8'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      spawnLantern(container, colors[i % colors.length]);
    }, i * 2000);
  }
}

function spawnLantern(container, color) {
  const l = document.createElement('div');
  l.className = 'lantern';
  const lx = rand(-60, 60);
  l.style.cssText = `
    left:${rand(5, 90)}vw;
    background: radial-gradient(circle at 40% 35%, rgba(255,255,255,.7), ${color});
    box-shadow: 0 0 16px ${color}, 0 0 40px ${color}88;
    --lx:${lx}px;
    animation-duration:${rand(10, 18)}s;
    animation-delay:0s;
  `;
  container.appendChild(l);
  setTimeout(() => l.remove(), 19000);
}

// ──────────────────────────────────────────────────
//  14. MINI EXPLOSION (gift / balloon / star)
// ──────────────────────────────────────────────────
function spawnMiniExplosion(percentX, percentY, count = 16, colors = CONFETTI_COLORS) {
  const cx = (percentX / 100) * window.innerWidth;
  const cy = (percentY / 100) * window.innerHeight;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; z-index:999; border-radius:50%;
      pointer-events:none;
      width:${rand(4, 10)}px; height:${rand(4, 10)}px;
      background:${colors[randInt(0, colors.length)]};
      left:${cx}px; top:${cy}px;
    `;
    document.body.appendChild(dot);
    const angle = rand(0, Math.PI * 2);
    const spd = rand(40, 120);
    dot.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * spd}px), calc(-50% + ${Math.sin(angle) * spd}px)) scale(0)`, opacity: 0 }
    ], { duration: rand(600, 1000), easing: 'ease-out', fill: 'forwards' });
    setTimeout(() => dot.remove(), 1100);
  }
}

// ──────────────────────────────────────────────────
//  15. TYPING WRITER
// ──────────────────────────────────────────────────
async function typeWriter(el, text, speed = 55) {
  el.textContent = '';
  for (const ch of text) {
    el.textContent += ch;
    await delay(speed);
  }
}

// ──────────────────────────────────────────────────
//  16. ACHIEVEMENT SYSTEM
// ──────────────────────────────────────────────────
let achieveTimeout;
function showAchievement(icon, title, desc) {
  achieveIcon.textContent = icon;
  achieveTitle.textContent = title;
  achieveDesc.textContent = desc;
  achieveToast.classList.add('show');
  clearTimeout(achieveTimeout);
  achieveTimeout = setTimeout(() => achieveToast.classList.remove('show'), 3500);
}



// ──────────────────────────────────────────────────
//  18. SECRET EASTER EGG BUTTON
// ──────────────────────────────────────────────────
function addTouchAndClick(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('touchend', e => { e.preventDefault(); fn(e); }, { passive: false });
}

addTouchAndClick(secretBtn, () => {
  State.easterEggClicks++;
  spawnMiniExplosion(
    (State.mouseX / window.innerWidth) * 100,
    (State.mouseY / window.innerHeight) * 100,
    30
  );

  if (State.easterEggClicks === 1) {
    showAchievement('Secret', 'Easter Egg Found!', 'You discovered the secret button');
  } else if (State.easterEggClicks === 5) {
    showAchievement('Rainbow', 'Rainbow Power!', 'Clicked the secret 5 times!');
    let i = 0;
    const hues = [0, 30, 60, 120, 180, 240, 280, 320];
    const iv = setInterval(() => {
      auroraLayer.style.filter = `hue-rotate(${hues[i++] || 0}deg)`;
      if (i >= hues.length) { clearInterval(iv); auroraLayer.style.filter = ''; }
    }, 180);
  } else if (State.easterEggClicks === 10) {
    showAchievement('Crown', 'Easter Egg Master!', 'You are incredibly curious!');
    for (let j = 0; j < 5; j++) setTimeout(() => ROCKETS.push(new Rocket(true)), j * 300);
  }
});

// ──────────────────────────────────────────────────
//  19. COUNTDOWN SEQUENCE
// ──────────────────────────────────────────────────
async function runCountdown() {
  for (let n = 3; n >= 1; n--) {
    countdownNumber.style.animation = 'none';
    countdownNumber.offsetWidth; // reflow
    countdownNumber.style.animation = 'countPulse .8s ease-out';
    countdownNumber.textContent = n;
    await delay(1000);
  }
  countdownNumber.style.animation = 'none';
  countdownNumber.offsetWidth;
  countdownNumber.style.animation = 'countPulse .5s ease-out';
  countdownNumber.textContent = '✨';
  await delay(700);
  countdownOverlay.classList.add('done');
}

// ──────────────────────────────────────────────────
//  20. INTRO TYPING SEQUENCE
// ──────────────────────────────────────────────────
async function startIntroTyping() {
  await delay(400);
  await typeWriter($('typingSpan'), 'Happy Birthday Brindha!', 70);
  await delay(300);
  await typeWriter($('introTagline'), 'Wishing you a wonderful day filled with happiness and success.', 40);
  $('startBtn').style.opacity = '0';
  $('startBtn').style.display = 'inline-flex';
  $('startBtn').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, fill: 'forwards' });
  $('startBtn').style.opacity = '1';
}

// ──────────────────────────────────────────────────
//  21. CAKE SECTION — CANDLE CLICK + TOUCH
// ──────────────────────────────────────────────────
function setupCandleInteraction() {
  $$('.candle-wrap').forEach(candle => {
    function blowCandle() {
      if (candle.classList.contains('blown')) return;
      candle.classList.add('blown');
      State.candlesBlown++;
      createSmoke(candle.querySelector('.smoke-wrap'));

      if (State.candlesBlown === State.totalCandles) {
        setTimeout(() => {
          $('cutCakeBtn').disabled = false;
          $('cutCakeBtn').querySelector('.btn-text').textContent = 'Cut The Cake';
          $('cakeControls').querySelector('.cake-hint').textContent = 'Now cut the cake!';
          showAchievement('Candle', 'Wish Maker!', 'All candles blown out!');
        }, 600);
      }
    }
    candle.addEventListener('click', blowCandle);
    candle.addEventListener('touchend', e => { e.preventDefault(); blowCandle(); }, { passive: false });
  });
}

function createSmoke(container) {
  for (let i = 0; i < 6; i++) {
    const smoke = document.createElement('div');
    smoke.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${rand(8, 18)}px; height:${rand(8, 18)}px;
      background:rgba(200,200,220,0.5);
      left:${rand(-5, 10)}px; top:0;
      filter:blur(${rand(2, 5)}px);
    `;
    container.appendChild(smoke);
    smoke.animate([
      { opacity: .8, transform: `translate(${rand(-5, 5)}px, 0) scale(1)` },
      { opacity: 0, transform: `translate(${rand(-20, 20)}px, ${-rand(40, 80)}px) scale(2.5)` }
    ], { duration: rand(800, 1400), delay: i * 100, easing: 'ease-out', fill: 'forwards' });
    setTimeout(() => smoke.remove(), 1600);
  }
}

// ──────────────────────────────────────────────────
//  22. CAKE CUTTING
// ──────────────────────────────────────────────────
function setupCakeCut() {
  function doCakeCut() {
    if (State.cakeCut) return;
    State.cakeCut = true;
    $('cutCakeBtn').disabled = true;

    const knifeWrap = $('knifeWrap');
    knifeWrap.classList.add('active');
    $('cakeStage').style.transition = 'transform 1.2s ease';
    $('cakeStage').style.transform = 'scale(1.3)';

    delay(1400).then(() => {
      $('cake3d').style.opacity = '0';
      $('cake3d').style.transition = 'opacity .3s';
      const halves = $('cakeCutHalves');
      halves.style.display = 'block';
      halves.querySelector('.cake-half-left').classList.add('split');
      halves.querySelector('.cake-half-right').classList.add('split');

      for (let i = 0; i < 20; i++) {
        const x = 40 + rand(20, 60), y = 40 + rand(20, 70);
        spawnMiniExplosion(x, y, 1, ['#fff', '#fde8c8', '#f5c0c0', '#d8f5c0']);
      }
      for (let i = 0; i < 6; i++) setTimeout(() => ROCKETS.push(new Rocket(false)), i * 200);
      spawnConfetti(150);

      return delay(800);
    }).then(() => {
      $('cakeStage').style.transform = 'scale(1)';
      showAchievement('Cake', 'Cake Cutter!', 'The cake has been cut!');
      // Auto-play music on cake cut (user gesture)
      
      return delay(1500);
    }).then(() => {
      $('cakeCutHalves').style.opacity = '0';
      $('cakeCutHalves').style.transition = 'opacity .5s';
      $('cakeControls').style.display = 'none';
      $('wishReveal').classList.add('show');
      return delay(4000);
    }).then(() => goToSection(3));
  }

  $('cutCakeBtn').addEventListener('click', doCakeCut);
  $('cutCakeBtn').addEventListener('touchend', e => { e.preventDefault(); doCakeCut(); }, { passive: false });
}

// ──────────────────────────────────────────────────
//  23. GIFT SECTION — centered overlay popup
// ──────────────────────────────────────────────────

// Gift data (emoji + message)
const GIFT_DATA = [
  {
    emoji: 'Trophy',
    msg: '"May every goal you set become a trophy on your shelf. You are destined for greatness, Brindha! The world is ready for everything you have to offer."'
  },
  {
    emoji: 'Smile',
    msg: '"Your smile lights up every room you walk into. May joy and laughter follow you everywhere like sunshine follows the morning. Happy Birthday, dear Brindha!"'
  },
  {
    emoji: 'Flower',
    msg: '"Wishing you a life full of vibrant energy, radiant health, and blooming wellbeing every single day. You deserve to feel wonderful always!"'
  },
  {
    emoji: '✨',
    msg: '"Every dream you carry in your heart deserves to come true. Believe in yourself — the universe is already conspiring in your favor, always!"'
  },
];

const giftOverlay = $('giftPopupOverlay');
const overlayEmoji = $('giftOverlayEmoji');
const overlayMsg = $('giftOverlayMsg');
const overlayCloseBtn = $('overlayCloseBtn');
let overlayOpenCount = 0; // how many gifts have been revealed so far

function showGiftOverlay(idx) {
  const data = GIFT_DATA[idx];
  overlayEmoji.textContent = data.emoji;
  overlayMsg.textContent = data.msg;
  giftOverlay.style.display = 'flex';
  // Re-trigger animation
  giftOverlay.style.animation = 'none';
  giftOverlay.offsetWidth;
  giftOverlay.style.animation = '';
}

function closeGiftOverlay() {
  giftOverlay.style.opacity = '0';
  giftOverlay.style.transition = 'opacity .3s ease';
  setTimeout(() => {
    giftOverlay.style.display = 'none';
    giftOverlay.style.opacity = '';
    giftOverlay.style.transition = '';

    overlayOpenCount++;
    if (overlayOpenCount === State.totalGifts) {
      // All gifts read — show continue button
      setTimeout(() => {
        const cont = $('giftsContinue');
        cont.classList.remove('hidden');
        cont.animate([
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' });
        cont.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }, 320);
}

addTouchAndClick(overlayCloseBtn, closeGiftOverlay);
// Tapping the backdrop (not the card) also closes
giftOverlay.addEventListener('click', e => {
  if (e.target === giftOverlay) closeGiftOverlay();
});
giftOverlay.addEventListener('touchend', e => {
  if (e.target === giftOverlay) { e.preventDefault(); closeGiftOverlay(); }
}, { passive: false });

function setupGifts() {
  $$('.gift-item').forEach((item, idx) => {
    item.addEventListener('mouseenter', () => {
      if (item.classList.contains('opened')) return;
      item.classList.add('shaking');
      setTimeout(() => item.classList.remove('shaking'), 500);
    });

    function handleGiftOpen() {
      if (item.classList.contains('opened')) return;
      item.classList.add('shaking');

      setTimeout(() => {
        item.classList.remove('shaking');
        item.classList.add('opened');

        // Explosion
        const rect = item.getBoundingClientRect();
        const cx = (rect.left + rect.width / 2) / window.innerWidth * 100;
        const cy = (rect.top + rect.height / 2) / window.innerHeight * 100;
        spawnMiniExplosion(cx, cy, 30);
        spawnMiniExplosion(cx, cy - 5, 10, ['#ff4da6', '#ff4da6', '#fbbf24', '#a78bfa']);

        

        State.giftsOpened++;
        if (State.giftsOpened === 1) showAchievement('Gift', 'First Gift!', 'You opened your first gift!');
        if (State.giftsOpened === State.totalGifts) showAchievement('Crown', 'All Gifts Opened!', 'You opened everything!');

        // Show the centered overlay
        setTimeout(() => showGiftOverlay(idx), 300);
      }, 200);
    }

    item.addEventListener('click', e => { e.stopPropagation(); handleGiftOpen(); });
    item.addEventListener('touchend', e => { e.preventDefault(); e.stopPropagation(); handleGiftOpen(); }, { passive: false });
  });

  addTouchAndClick($('toFinaleBtn'), () => goToSection(4));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  24. PARALLAX â€” mouse + touch
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function handleMove(x, y) {
  State.mouseX = x;
  State.mouseY = y;
  cursorGlow.style.left = x + 'px';
  cursorGlow.style.top = y + 'px';

  const cx = (x / window.innerWidth - 0.5) * 2;
  const cy = (y / window.innerHeight - 0.5) * 2;
  auroraLayer.style.transform = `translate(${cx * -10}px, ${cy * -8}px)`;

  const hue = Math.round((x / window.innerWidth) * 60) + 300;
  cursorGlow.style.background = `radial-gradient(circle, hsla(${hue},100%,75%,.7) 0%, transparent 70%)`;

  // Trail
  mousePositions.unshift({ x, y });
  if (mousePositions.length > TRAIL_DOTS) mousePositions.length = TRAIL_DOTS;
  trailDots.forEach((d, i) => {
    const pos = mousePositions[i] || mousePositions[mousePositions.length - 1];
    if (pos) { d.el.style.left = pos.x + 'px'; d.el.style.top = pos.y + 'px'; }
  });

  // Magnetic buttons (desktop only)
  if (!isMobile()) {
    $$('.glow-btn').forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const bx = rect.left + rect.width / 2;
      const by = rect.top + rect.height / 2;
      const dist = Math.hypot(x - bx, y - by);
      if (dist < 80) {
        const mx = (x - bx) * .25, my = (y - by) * .25;
        btn.style.transform = `translate(${mx}px, ${my}px) scale(1.05)`;
      } else { btn.style.transform = ''; }
    });
  }
}

window.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
window.addEventListener('touchmove', e => {
  if (e.touches.length > 0) {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//  25. LENS FLARE on click + touch
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function spawnFlare(x, y) {
  const flare = document.createElement('div');
  flare.style.cssText = `
    position:fixed; z-index:888; pointer-events:none;
    border-radius:50%; mix-blend-mode:screen;
    width:80px; height:80px;
    background: radial-gradient(circle, rgba(255,240,200,.9) 0%, rgba(255,180,100,.4) 40%, transparent 70%);
    left:${x}px; top:${y}px;
    transform:translate(-50%,-50%) scale(0);
  `;
  document.body.appendChild(flare);
  flare.animate([
    { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 },
    { transform: 'translate(-50%,-50%) scale(3)', opacity: 0 }
  ], { duration: 500, easing: 'ease-out', fill: 'forwards' });
  setTimeout(() => flare.remove(), 550);
}

window.addEventListener('click', e => spawnFlare(e.clientX, e.clientY));
window.addEventListener('touchstart', e => {
  if (e.touches.length > 0) spawnFlare(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// ──────────────────────────────────────────────────
//  BACKGROUND MUSIC — YouTube IFrame API
// ──────────────────────────────────────────────────
let ytPlayer = null;
let ytReady = false;

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: 'O2WN6glcSsM',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: 'O2WN6glcSsM',
    },
    events: {
      onReady(e) {
        ytReady = true;
        e.target.setVolume(55);
      },
      onStateChange(e) {
        if (e.data === YT.PlayerState.ENDED) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        }
      }
    }
  });
};

function tryPlayMusic() {
  if (ytReady && ytPlayer && typeof ytPlayer.playVideo === 'function') {
    ytPlayer.playVideo();
  } else {
    setTimeout(tryPlayMusic, 500);
  }
}

// ──────────────────────────────────────────────────
//  26. KICK OFF
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function init() {
  // Reduce particle count on mobile for performance
  const mobile = isMobile();
  if (mobile) {
    // Reduce bg particles
    BG_PARTICLES.length = 80;
  }

  buildIntroEnvironment();
  setupCandleInteraction();
  setupCakeCut();
  setupGifts();

    // No prompt needed, music will start on Start click

  // Countdown â†’ intro
  await runCountdown();
  await startIntroTyping();

  // Start button
  addTouchAndClick($('startBtn'), () => {
    // Start background music
    tryPlayMusic();
    
    goToSection(2);
    showAchievement('Start', 'Adventure Begins!', 'The surprise has started!');
  });
}

init();
