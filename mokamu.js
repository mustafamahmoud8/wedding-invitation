/* ══════════════════════════════════════════════
   MOKAMU-STYLE WEDDING — Main Script v2
   Seal click triggers opening animation
══════════════════════════════════════════════ */

// ── DOM refs ──
const openingScreen  = document.getElementById('openingScreen');
const openBtn        = document.getElementById('openBtn');      // = seal button
const mainInvitation = document.getElementById('mainInvitation');
const lightBurst     = document.getElementById('lightBurst');
const envFlap        = document.getElementById('envFlap');
const sealWrap       = document.getElementById('sealWrap');
const cardReveal     = document.getElementById('cardReveal');
const envelopeFloat  = document.getElementById('envelopeFloat');
const tapHint        = document.getElementById('tapHint');
const dove           = document.getElementById('dove');

// ── Audio ──
const soundscapeAudio = document.getElementById('soundscapeAudio');
const bgMusicAudio    = document.getElementById('bgMusicAudio');
const leavesAudio     = document.getElementById('leavesAudio');
const musicBtn        = document.getElementById('musicBtn');
const musicIcon       = document.getElementById('musicIcon');
let musicMuted = false;
let opened = false;

// ══════════════════════════════════════════════
// AMBIENT MOTES
// ══════════════════════════════════════════════
function initAmbientMotes() {
  const container = document.getElementById('ambientMotes');
  for (let i = 0; i < 18; i++) {
    const m = document.createElement('div');
    m.className = 'ambient__mote';
    const size = 4 + Math.random() * 8;
    m.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;--drift:${(Math.random()-.5)*80}px;animation-duration:${12+Math.random()*20}s;animation-delay:${-Math.random()*20}s;`;
    container.appendChild(m);
  }
}
initAmbientMotes();

// ══════════════════════════════════════════════
// PETAL RAIN
// ══════════════════════════════════════════════
const PETALS = [
  {left:4,size:26,dur:13,delay:-2,drift:34,spin:210,op:.85},
  {left:14,size:18,dur:10,delay:-6,drift:-22,spin:-160,op:.7},
  {left:24,size:30,dur:15,delay:-1,drift:40,spin:260,op:.9},
  {left:34,size:16,dur:9,delay:-4,drift:-30,spin:-140,op:.7},
  {left:44,size:22,dur:12,delay:-3,drift:28,spin:190,op:.75},
  {left:54,size:28,dur:14,delay:-5,drift:-38,spin:230,op:.8},
  {left:64,size:20,dur:11,delay:-2,drift:42,spin:-200,op:.65},
  {left:74,size:32,dur:16,delay:-7,drift:-20,spin:180,op:.9},
  {left:84,size:14,dur:8,delay:-1,drift:35,spin:-150,op:.6},
  {left:94,size:24,dur:13,delay:-4,drift:-45,spin:240,op:.8},
  {left:8,size:36,dur:18,delay:-8,drift:55,spin:300,op:.95},
  {left:18,size:12,dur:7,delay:-3,drift:-18,spin:-120,op:.55},
  {left:28,size:40,dur:20,delay:-10,drift:70,spin:350,op:1},
  {left:38,size:10,dur:6,delay:-2,drift:-25,spin:-90,op:.5},
  {left:48,size:34,dur:17,delay:-6,drift:48,spin:280,op:.85},
  {left:58,size:8,dur:5,delay:-1,drift:-15,spin:-80,op:.45},
  {left:68,size:42,dur:22,delay:-9,drift:65,spin:320,op:.95},
  {left:78,size:15,dur:9,delay:-4,drift:-35,spin:-170,op:.6},
  {left:88,size:28,dur:14,delay:-5,drift:52,spin:270,op:.8},
  {left:98,size:20,dur:11,delay:-3,drift:-42,spin:-220,op:.7},
];

function createPetals(containerId, petals, opacityMult = 1) {
  const container = document.getElementById(containerId);
  if (!container) return;
  petals.forEach(p => {
    const el = document.createElement('img');
    el.className = 'petal';
    el.src = p.size > 28 ? 'assets/rose-petal1-DlYa-Dca.png' : 'assets/rose-petal-DS8fjcGP.png';
    el.draggable = false;
    el.style.cssText = `left:${p.left}%;width:${p.size}px;height:auto;--spin:${p.spin}deg;--drift:${p.drift}px;animation-duration:${p.dur}s;animation-delay:${p.delay}s;animation-iteration-count:infinite;opacity:${p.op * opacityMult};`;
    container.appendChild(el);
  });
}
createPetals('openingPetals', PETALS);

// ══════════════════════════════════════════════
// AUDIO HELPERS
// ══════════════════════════════════════════════
function fadeAudio(audio, targetVol, ms) {
  const steps = 40, interval = ms / steps;
  const delta = (targetVol - audio.volume) / steps;
  let step = 0;
  const t = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
    if (step >= steps) clearInterval(t);
  }, interval);
}

function startOpeningAudio() {
  soundscapeAudio.volume = 0;
  soundscapeAudio.play().catch(() => {});
  fadeAudio(soundscapeAudio, 0.72, 1800);
  leavesAudio.volume = 0;
  leavesAudio.play().catch(() => {});
  fadeAudio(leavesAudio, 0.25, 2500);
}

function switchToBgMusic() {
  fadeAudio(soundscapeAudio, 0, 1500);
  fadeAudio(leavesAudio, 0, 1500);
  setTimeout(() => {
    soundscapeAudio.pause();
    leavesAudio.pause();
    bgMusicAudio.volume = 0;
    bgMusicAudio.play().catch(() => {});
    fadeAudio(bgMusicAudio, 0.5, 2000);
  }, 1500);
}

// ══════════════════════════════════════════════
// DOVE DEPARTURE
// ══════════════════════════════════════════════
function doveDepart() {
  if (!dove) return;
  dove.style.animation = '1.9s cubic-bezier(.4,0,.2,1) forwards dove-depart';
  const glide   = dove.querySelector('.opening-screen__dove-layer--glide-body');
  const perched = dove.querySelector('.opening-screen__dove-layer--perched-body');
  const wing1   = dove.querySelector('.opening-screen__dove-wing--arrive');
  const wing2   = dove.querySelector('.opening-screen__dove-wing--depart');
  if (glide)   glide.style.animation   = '.45s ease-out forwards dove-departure-fade-in';
  if (perched) perched.style.animation = '.45s ease-out forwards dove-departure-fade-out';
  if (wing1)   wing1.style.animation   = '.45s ease-out forwards dove-departure-fade-in,.9s ease-in-out .45s infinite wing-flap-slow';
  if (wing2)   wing2.style.animation   = '.45s ease-out forwards dove-departure-fade-in,.95s ease-in-out .45s infinite wing-flap-slow';
}

// ══════════════════════════════════════════════
// SEAL (=OPEN BTN) CLICK → ENVELOPE ANIMATION
// ══════════════════════════════════════════════
openBtn.addEventListener('click', () => {
  if (opened) return;
  opened = true;

  // Start audio on user interaction
  startOpeningAudio();

  // Hide seal hint text
  const hint = document.getElementById('sealHint');
  if (hint) hint.style.opacity = '0';
  if (tapHint) tapHint.style.display = 'none';

  // Dove & branch depart
  doveDepart();
  const branch = document.querySelector('.opening-screen__branch');
  if (branch) branch.style.animation = '1.9s cubic-bezier(.4,0,.2,1) forwards branch-depart';

  // Seal shrink animation before hiding
  sealWrap.style.transition = 'transform .4s var(--ease-sig), opacity .4s';
  sealWrap.style.transform  = 'translate(-50%,-50%) scale(1.3)';
  sealWrap.style.opacity    = '1';

  // Step 1 (300ms): Light burst + seal pulse
  setTimeout(() => {
    lightBurst.classList.add('flash');
    setTimeout(() => lightBurst.classList.remove('flash'), 800);
    sealWrap.classList.add('hidden-seal');
  }, 300);

  // Step 2 (500ms): Open flap
  setTimeout(() => {
    envFlap.classList.add('open');
  }, 500);

  // Step 3 (1100ms): Reveal card
  setTimeout(() => {
    cardReveal.classList.add('revealed');
  }, 1100);

  // Step 4 (2000ms): Stop envelope sway, zoom effect
  setTimeout(() => {
    envelopeFloat.style.animation = 'none';
    envelopeFloat.style.transition = 'transform 1.2s cubic-bezier(.22,1,.36,1), opacity .8s';
    envelopeFloat.style.transform  = 'scale(1.06) translateY(-4vh)';
    lightBurst.classList.add('flash');
    setTimeout(() => lightBurst.classList.remove('flash'), 800);
  }, 2000);

  // Step 5 (3000ms): Reveal main invitation
  setTimeout(() => {
    openingScreen.classList.add('gone');
    mainInvitation.classList.remove('hidden');
    mainInvitation.style.opacity    = '0';
    mainInvitation.style.transition = 'opacity .9s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      mainInvitation.style.opacity = '1';
    }));

    switchToBgMusic();
    initScrollReveal();
    startCountdown();
    createPetals('heroPetals', PETALS.slice(0, 10), 0.35);
    renderWishes();

    setTimeout(() => { if (openingScreen.parentNode) openingScreen.remove(); }, 1200);
  }, 3000);
});

// ══════════════════════════════════════════════
// MUSIC BUTTON
// ══════════════════════════════════════════════
const SVG_ON  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 9.5a4 4 0 0 1 0 5"/><path d="M19.5 7a7 7 0 0 1 0 10"/></svg>`;
const SVG_OFF = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 4 6"/><path d="m21 9-4 6"/></svg>`;

musicBtn.addEventListener('click', () => {
  musicMuted = !musicMuted;
  [soundscapeAudio, bgMusicAudio, leavesAudio].forEach(a => { a.muted = musicMuted; });
  musicIcon.innerHTML = musicMuted ? SVG_OFF : SVG_ON;
  musicBtn.classList.toggle('music-player__button--muted', musicMuted);
  musicBtn.setAttribute('aria-pressed', String(musicMuted));
});

// ══════════════════════════════════════════════
// COUNTDOWN
// ══════════════════════════════════════════════
function startCountdown() {
  const target = new Date('2027-07-17T20:00:00');
  const dEl = document.getElementById('days');
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');
  if (sEl) sEl.style.transition = 'transform .14s ease';

  function tick() {
    const diff = target - new Date();
    if (diff <= 0) {
      [dEl,hEl,mEl,sEl].forEach(el => { if(el) el.textContent = '00'; });
      return;
    }
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    if(dEl) dEl.textContent = String(d).padStart(2,'0');
    if(hEl) hEl.textContent = String(h).padStart(2,'0');
    if(mEl) mEl.textContent = String(m).padStart(2,'0');
    if(sEl && sEl.textContent !== String(s).padStart(2,'0')) {
      sEl.style.transform = 'scale(1.18)';
      sEl.textContent = String(s).padStart(2,'0');
      setTimeout(() => { sEl.style.transform = 'scale(1)'; }, 140);
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.style.transitionDelay || '0') * 1000;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ══════════════════════════════════════════════
// WISHES
// ══════════════════════════════════════════════
let wishes = [];

function renderWishes() {
  const list = document.getElementById('wishesList');
  if (!list) return;
  list.innerHTML = '';
  wishes.forEach(w => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `<div class="wish-card__name">— ${w.name}</div><div class="wish-card__text">${w.text}</div>`;
    list.appendChild(card);
  });
}

function sendWishWhatsapp() {
  const nameEl = document.getElementById('wishName');
  const textEl = document.getElementById('wishText');
  const name = nameEl.value.trim();
  const text = textEl.value.trim();
  if (!name || !text) {
    const bad = !name ? nameEl : textEl;
    bad.style.borderColor = '#c0392b';
    bad.classList.add('shake');
    bad.focus();
    setTimeout(() => { bad.style.borderColor = ''; bad.classList.remove('shake'); }, 2000);
    return;
  }
  const msg = encodeURIComponent(`تهنئة من: ${name}\n\n${text}`);
  window.open(`https://wa.me/201093421310?text=${msg}`, '_blank');
  nameEl.value = ''; textEl.value = '';
  const btn = document.getElementById('wishSendBtn');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ تم الإرسال عبر واتساب!';
    btn.style.opacity = '.75';
    setTimeout(() => { btn.innerHTML = orig; btn.style.opacity = ''; }, 3000);
  }
}
window.sendWishWhatsapp = sendWishWhatsapp;

// ══════════════════════════════════════════════
// CONFETTI (not used now but kept)
// ══════════════════════════════════════════════
function confettiEffect() {
  const colors = ['#D4AF37','#a9825c','#c7a377','#7c8a6e','#f7f1e6'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed;left:${Math.random()*100}vw;top:-10px;width:${4+Math.random()*9}px;height:${4+Math.random()*9}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:${Math.random()>.5?'50%':'3px'};z-index:9998;pointer-events:none;animation:confettiFall ${2+Math.random()*3}s ease forwards;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5500);
    }, i * 45);
  }
  if (!document.getElementById('confetti-kf')) {
    const s = document.createElement('style');
    s.id = 'confetti-kf';
    s.textContent = '@keyframes confettiFall{0%{transform:translateY(0)rotate(0);opacity:1}100%{transform:translateY(100vh)rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
}

// ══════════════════════════════════════════════
// DYNAMIC KEYFRAMES
// ══════════════════════════════════════════════
(function() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes branch-depart{0%{opacity:1;transform:translate(0)rotate(0)scale(1)}100%{opacity:0;transform:translate(-70vw)rotate(-5deg)scale(.97)}}
    @keyframes dove-departure-fade-out{0%{opacity:1}100%{opacity:0}}
    @keyframes dove-departure-fade-in{0%{opacity:0}100%{opacity:1}}
    @keyframes wing-flap-slow{0%,100%{transform:rotate(0)}50%{transform:rotate(-12deg)}}
    @keyframes dove-depart{0%{opacity:1;transform:translate(0)rotate(0)scale(1)}100%{opacity:0;transform:translate(-95vw,-14vh)rotate(-16deg)scale(.85)}}
  `;
  document.head.appendChild(s);
})();
