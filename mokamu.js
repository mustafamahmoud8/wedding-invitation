/* ══════════════════════════════════════════════
   MOKAMU-STYLE WEDDING — Main Script
   Replicating mokamu.com opening experience
══════════════════════════════════════════════ */

// ── DOM references ──
const openingScreen  = document.getElementById('openingScreen');
const openBtn        = document.getElementById('openBtn');
const mainInvitation = document.getElementById('mainInvitation');
const lightBurst     = document.getElementById('lightBurst');
const envFlap        = document.getElementById('envFlap');
const sealWrap       = document.getElementById('sealWrap');
const cardReveal     = document.getElementById('cardReveal');
const openCta        = document.getElementById('openCta');
const envelopeFloat  = document.getElementById('envelopeFloat');
const dove           = document.getElementById('dove');

// ── Audio ──
const soundscapeAudio = document.getElementById('soundscapeAudio');
const bgMusicAudio    = document.getElementById('bgMusicAudio');
const leavesAudio     = document.getElementById('leavesAudio');
const musicBtn        = document.getElementById('musicBtn');
const musicIcon       = document.getElementById('musicIcon');
let musicMuted = false;

// Preload all audio
[soundscapeAudio, bgMusicAudio, leavesAudio].forEach(a => { a.preload = 'auto'; a.volume = 0; });

// ── State ──
let opened = false;

// ══════════════════════════════════════════════
// AMBIENT MOTES (floating dust particles)
// ══════════════════════════════════════════════
function initAmbientMotes() {
  const container = document.getElementById('ambientMotes');
  const count = 18;
  for (let i = 0; i < count; i++) {
    const m = document.createElement('div');
    m.className = 'ambient__mote';
    const size = 4 + Math.random() * 8;
    m.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --drift: ${(Math.random() - .5) * 80}px;
      animation-duration: ${12 + Math.random() * 20}s;
      animation-delay: ${-Math.random() * 20}s;
    `;
    container.appendChild(m);
  }
}
initAmbientMotes();

// ══════════════════════════════════════════════
// PETAL RAIN (opening screen)
// ══════════════════════════════════════════════
const PETAL_DATA = [
  { left:4,  size:26, duration:13, delay:-2,  drift:34,   spin:210, opacity:.85 },
  { left:14, size:18, duration:10, delay:-6,  drift:-22,  spin:-160,opacity:.7  },
  { left:24, size:30, duration:15, delay:-1,  drift:40,   spin:260, opacity:.9  },
  { left:34, size:16, duration:9,  delay:-4,  drift:-30,  spin:-140,opacity:.7  },
  { left:44, size:22, duration:12, delay:-3,  drift:28,   spin:190, opacity:.75 },
  { left:54, size:28, duration:14, delay:-5,  drift:-38,  spin:230, opacity:.8  },
  { left:64, size:20, duration:11, delay:-2,  drift:42,   spin:-200,opacity:.65 },
  { left:74, size:32, duration:16, delay:-7,  drift:-20,  spin:180, opacity:.9  },
  { left:84, size:14, duration:8,  delay:-1,  drift:35,   spin:-150,opacity:.6  },
  { left:94, size:24, duration:13, delay:-4,  drift:-45,  spin:240, opacity:.8  },
  { left:8,  size:36, duration:18, delay:-8,  drift:55,   spin:300, opacity:.95 },
  { left:18, size:12, duration:7,  delay:-3,  drift:-18,  spin:-120,opacity:.55 },
  { left:28, size:40, duration:20, delay:-10, drift:70,   spin:350, opacity:1   },
  { left:38, size:10, duration:6,  delay:-2,  drift:-25,  spin:-90, opacity:.5  },
  { left:48, size:34, duration:17, delay:-6,  drift:48,   spin:280, opacity:.85 },
  { left:58, size:8,  duration:5,  delay:-1,  drift:-15,  spin:-80, opacity:.45 },
  { left:68, size:42, duration:22, delay:-9,  drift:65,   spin:320, opacity:.95 },
  { left:78, size:15, duration:9,  delay:-4,  drift:-35,  spin:-170,opacity:.6  },
  { left:88, size:28, duration:14, delay:-5,  drift:52,   spin:270, opacity:.8  },
  { left:98, size:20, duration:11, delay:-3,  drift:-42,  spin:-220,opacity:.7  },
];

function createPetals(containerId, petals) {
  const container = document.getElementById(containerId);
  if (!container) return;
  petals.forEach(p => {
    const el = document.createElement('img');
    el.className = 'petal';
    el.src = p.size > 28 ? 'assets/rose-petal1-DlYa-Dca.png' : 'assets/rose-petal-DS8fjcGP.png';
    el.draggable = false;
    el.style.cssText = `
      left: ${p.left}%;
      width: ${p.size}px;
      height: auto;
      --spin: ${p.spin}deg;
      --drift: ${p.drift}px;
      animation-duration: ${p.duration}s;
      animation-delay: ${p.delay}s;
      animation-iteration-count: infinite;
      opacity: ${p.opacity};
    `;
    container.appendChild(el);
  });
}

createPetals('openingPetals', PETAL_DATA);

// ══════════════════════════════════════════════
// AUDIO FADE UTILITY
// ══════════════════════════════════════════════
function fadeAudio(audio, targetVol, durationMs) {
  const steps = 40;
  const interval = durationMs / steps;
  const delta = (targetVol - audio.volume) / steps;
  let step = 0;
  const t = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
    if (step >= steps) clearInterval(t);
  }, interval);
}

function startAudio() {
  soundscapeAudio.volume = 0;
  soundscapeAudio.play().catch(() => {});
  fadeAudio(soundscapeAudio, 0.72, 1800);

  // Also start leaves audio softly
  leavesAudio.volume = 0;
  leavesAudio.play().catch(() => {});
  fadeAudio(leavesAudio, 0.25, 2500);
}

function startBgMusic() {
  soundscapeAudio.pause();
  leavesAudio.pause();
  bgMusicAudio.volume = 0;
  bgMusicAudio.play().catch(() => {});
  fadeAudio(bgMusicAudio, 0.55, 2000);
}

// ══════════════════════════════════════════════
// DOVE DEPARTURE & BUTTON REVEAL
// ══════════════════════════════════════════════
// After 13s the dove is perched. Apply departure states.
function doveDepart() {
  if (dove) {
    dove.style.animation = '1.9s cubic-bezier(.4,0,.2,1) forwards dove-depart';
    // Show glide body
    const glide = dove.querySelector('.opening-screen__dove-layer--glide-body');
    const perched = dove.querySelector('.opening-screen__dove-layer--perched-body');
    const wing1 = dove.querySelector('.opening-screen__dove-wing--arrive');
    const wing2 = dove.querySelector('.opening-screen__dove-wing--depart');
    if (glide) glide.style.animation = '.45s ease-out forwards dove-departure-fade-in';
    if (perched) perched.style.animation = '.45s ease-out forwards dove-departure-fade-out';
    if (wing1) wing1.style.animation = '.45s ease-out forwards dove-departure-fade-in, .9s ease-in-out .45s infinite wing-flap-slow';
    if (wing2) wing2.style.animation = '.45s ease-out forwards dove-departure-fade-in, .95s ease-in-out .45s infinite wing-flap-slow';
  }
}

// ══════════════════════════════════════════════
// OPEN BUTTON → ENVELOPE ANIMATION
// ══════════════════════════════════════════════
openBtn.addEventListener('click', () => {
  if (opened) return;
  opened = true;

  // Trigger audio (user interaction)
  startAudio();

  // Hide CTA
  openCta.style.transition = 'opacity .4s';
  openCta.style.opacity = '0';
  setTimeout(() => { openCta.style.display = 'none'; }, 400);

  // Dove departs
  doveDepart();

  // Branch departs
  const branch = document.querySelector('.opening-screen__branch');
  if (branch) {
    branch.style.animation = '1.9s cubic-bezier(.4,0,.2,1) forwards branch-depart';
  }

  // Step 1 (500ms): Flash light burst
  setTimeout(() => {
    lightBurst.classList.add('flash');
    setTimeout(() => lightBurst.classList.remove('flash'), 800);
  }, 500);

  // Step 2 (600ms): Open flap
  setTimeout(() => {
    envFlap.classList.add('open');
  }, 600);

  // Step 3 (700ms): Hide seal
  setTimeout(() => {
    sealWrap.classList.add('hidden-seal');
  }, 700);

  // Step 4 (1200ms): Reveal card from envelope
  setTimeout(() => {
    cardReveal.classList.add('revealed');
  }, 1200);

  // Step 5 (2200ms): Stop float, expand envelope to full, reveal main
  setTimeout(() => {
    envelopeFloat.style.animation = 'none';
    envelopeFloat.style.transition = 'transform 1.2s var(--ease-sig), opacity .8s';
    envelopeFloat.style.transform = 'scale(1.08) translateY(-3vh)';

    // Light burst again
    lightBurst.classList.add('flash');
    setTimeout(() => lightBurst.classList.remove('flash'), 800);
  }, 2200);

  // Step 6 (3200ms): Fade out opening, show main
  setTimeout(() => {
    openingScreen.classList.add('gone');
    mainInvitation.classList.remove('hidden');

    // Fade in main
    mainInvitation.style.opacity = '0';
    mainInvitation.style.transition = 'opacity .8s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainInvitation.style.opacity = '1';
      });
    });

    // Start main music
    startBgMusic();
    initScrollReveal();
    startCountdown();
    createHeroPetals();
    renderWishes();

    // Remove opening from DOM after transition
    setTimeout(() => { openingScreen.remove(); }, 1200);

  }, 3200);
});

// ══════════════════════════════════════════════
// MUSIC PLAYER
// ══════════════════════════════════════════════
const MUTED_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 9v6h4l5 4V5L8 9H4Z"/>
    <path d="m17 9 4 6"/><path d="m21 9-4 6"/>
  </svg>`;
const PLAYING_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 9v6h4l5 4V5L8 9H4Z"/>
    <path d="M17 9.5a4 4 0 0 1 0 5"/>
    <path d="M19.5 7a7 7 0 0 1 0 10"/>
  </svg>`;

musicBtn.addEventListener('click', () => {
  musicMuted = !musicMuted;
  [soundscapeAudio, bgMusicAudio, leavesAudio].forEach(a => { a.muted = musicMuted; });
  musicIcon.innerHTML = musicMuted ? MUTED_SVG : PLAYING_SVG;
  musicBtn.classList.toggle('music-player__button--muted', musicMuted);
  musicBtn.setAttribute('aria-pressed', musicMuted);
});

// ══════════════════════════════════════════════
// HERO PETALS (after opening)
// ══════════════════════════════════════════════
function createHeroPetals() {
  createPetals('heroPetals', PETAL_DATA.slice(0, 10).map(p => ({
    ...p,
    opacity: p.opacity * 0.4,
    duration: p.duration * 1.4,
  })));
}

// ══════════════════════════════════════════════
// COUNTDOWN
// ══════════════════════════════════════════════
function startCountdown() {
  const eventDate = new Date('2027-07-17T20:00:00');

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function tick() {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      ['days','hours','minutes','seconds'].forEach(id => { document.getElementById(id).textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    daysEl.textContent    = String(d).padStart(2,'0');
    hoursEl.textContent   = String(h).padStart(2,'0');
    minutesEl.textContent = String(m).padStart(2,'0');

    // Animate seconds
    if (secondsEl.textContent !== String(s).padStart(2,'0')) {
      secondsEl.style.transform = 'scale(1.18)';
      secondsEl.textContent = String(s).padStart(2,'0');
      setTimeout(() => { secondsEl.style.transform = 'scale(1)'; }, 140);
    }
  }
  tick();
  setInterval(tick, 1000);
  if (secondsEl) secondsEl.style.transition = 'transform .14s ease';
}

// ══════════════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════════════
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = parseFloat(e.target.style.transitionDelay || '0') * 1000;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ══════════════════════════════════════════════
// RSVP
// ══════════════════════════════════════════════
function rsvpAction(type) {
  const msg = document.getElementById('rsvpMsg');
  msg.classList.remove('hidden', 'rsvp-msg--accept', 'rsvp-msg--decline');

  if (type === 'accept') {
    msg.classList.add('rsvp-msg--accept');
    msg.textContent = '🌿 جزاكم الله خيراً على تأكيد حضوركم الكريم، يسعدنا وجودكم معنا في هذه الليلة المباركة 💛';
    confettiEffect();
  } else {
    msg.classList.add('rsvp-msg--decline');
    msg.textContent = '🌿 نأسف لاعتذاركم، وندعو الله أن يجمعنا دائماً في مناسبات سعيدة 🙏';
  }
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
window.rsvpAction = rsvpAction;

// Confetti
function confettiEffect() {
  const colors = ['#D4AF37','#a9825c','#c7a377','#7c8a6e','#f7f1e6','#e6d6c2'];
  for (let i = 0; i < 70; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.style.cssText = `
        position:fixed; left:${Math.random()*100}vw; top:-10px;
        width:${4+Math.random()*9}px; height:${4+Math.random()*9}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>.5?'50%':'3px'};
        z-index:9998; pointer-events:none;
        animation:confettiFall ${2+Math.random()*3}s ease forwards;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5500);
    }, i * 40);
  }
  if (!document.getElementById('confetti-kf')) {
    const s = document.createElement('style');
    s.id = 'confetti-kf';
    s.textContent = '@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
}

// Add missing keyframes dynamically
(function addKeyframes() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes branch-depart{0%{opacity:1;transform:translate(0) rotate(0) scale(1)}100%{opacity:0;transform:translate(-70vw) rotate(-5deg) scale(.97)}}
    @keyframes dove-departure-fade-out{0%{opacity:1}100%{opacity:0}}
    @keyframes dove-departure-fade-in{0%{opacity:0}100%{opacity:1}}
    @keyframes wing-flap-slow{0%,100%{transform:rotate(0)}50%{transform:rotate(-12deg)}}
    @keyframes dove-depart{0%{opacity:1;transform:translate(0) rotate(0) scale(1)}100%{opacity:0;transform:translate(-95vw,-14vh) rotate(-16deg) scale(.85)}}
  `;
  document.head.appendChild(s);
})();

// ══════════════════════════════════════════════
// WISHES
// ══════════════════════════════════════════════
let wishes = [
  { name: 'أم العريس', text: 'بارك الله لكما وعليكما وجمع بينكما في خير 💛' },
  { name: 'أهل البيت', text: 'ألف مبروك ياغالين، ربنا يتمم عليكم بالسعادة 🌿' },
];

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

function sendWish() {
  const nameEl = document.getElementById('wishName');
  const textEl = document.getElementById('wishText');
  const name = nameEl.value.trim();
  const text = textEl.value.trim();

  if (!name || !text) {
    const el = !name ? nameEl : textEl;
    el.style.borderColor = '#c0392b';
    el.focus();
    setTimeout(() => { el.style.borderColor = ''; }, 2000);
    return;
  }

  wishes.unshift({ name, text });
  renderWishes();
  nameEl.value = ''; textEl.value = '';

  const btn = document.querySelector('.wish-form .btn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="20,6 9,17 4,12"/></svg> تم الإرسال!';
  btn.style.background = '#7c8a6e'; btn.style.borderColor = '#7c8a6e';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 2500);
}
window.sendWish = sendWish;
