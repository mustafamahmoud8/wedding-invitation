/* ===== Wedding Invitation - Main Script ===== */

// ===== Splash Screen =====
const enterBtn = document.getElementById('enterBtn');
const splash = document.getElementById('splash');
const mainContent = document.getElementById('mainContent');

enterBtn.addEventListener('click', () => {
  splash.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  splash.style.opacity = '0';
  splash.style.transform = 'scale(1.05)';
  setTimeout(() => {
    splash.style.display = 'none';
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.8s ease';
    requestAnimationFrame(() => {
      mainContent.style.opacity = '1';
    });
    // Start music on enter
    tryPlayMusic();
    // Init particles
    createParticles();
    // Start countdown
    startCountdown();
    // Init scroll reveal
    initScrollReveal();
  }, 800);
});

// ===== Music Player =====
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let isPlaying = false;

function tryPlayMusic() {
  bgMusic.volume = 0.35;
  bgMusic.play().then(() => {
    isPlaying = true;
    musicBtn.classList.add('playing');
    musicIcon.className = 'fas fa-pause';
  }).catch(() => {
    // Autoplay blocked - wait for user interaction
    isPlaying = false;
  });
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicIcon.className = 'fas fa-music';
  } else {
    bgMusic.play();
    isPlaying = true;
    musicBtn.classList.add('playing');
    musicIcon.className = 'fas fa-pause';
  }
});

// ===== Floating Particles =====
function createParticles() {
  const container = document.getElementById('particles-container');
  const count = 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const isPetal = Math.random() > 0.6;
    p.classList.add('particle');
    if (isPetal) p.classList.add('petal');

    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (6 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = (4 + Math.random() * 6) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = 0;

    container.appendChild(p);
  }
}

// ===== Countdown Timer =====
function startCountdown() {
  // Set your event date here
  const eventDate = new Date('2027-07-17T20:00:00');

  function update() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      clearInterval(timer);
      // Show celebration message
      const countdown = document.querySelector('.countdown');
      if (countdown) {
        countdown.insertAdjacentHTML('afterend',
          '<div style="color:var(--gold);font-size:1.3rem;margin-top:15px;animation:pulse 1s infinite">🎉 مبروك! حفل الزفاف اليوم! 🎉</div>'
        );
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Animate seconds number
    const secEl = document.getElementById('seconds');
    secEl.style.transform = 'scale(1.15)';
    setTimeout(() => { secEl.style.transform = 'scale(1)'; }, 150);
  }

  update();
  const timer = setInterval(update, 1000);
}

// ===== Scroll Reveal Animation =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

// ===== RSVP =====
function rsvp(type) {
  const msgEl = document.getElementById('rsvpMessage');
  const acceptBtn = document.getElementById('acceptBtn');
  const declineBtn = document.getElementById('declineBtn');

  msgEl.classList.remove('hidden', 'accept-msg', 'decline-msg');

  if (type === 'accept') {
    msgEl.classList.add('accept-msg');
    msgEl.innerHTML = '🌿 جزاكم الله خيراً على تأكيد حضوركم الكريم، يسعدنا وجودكم معنا في هذه الليلة المباركة 💛';
    acceptBtn.style.transform = 'scale(1.05)';
    acceptBtn.style.boxShadow = '0 10px 35px rgba(11,59,44,0.5)';
    confettiEffect();
  } else {
    msgEl.classList.add('decline-msg');
    msgEl.innerHTML = '🌿 نأسف لاعتذاركم، وندعو الله أن يجمعنا دائماً في مناسبات سعيدة 🙏';
    declineBtn.style.borderColor = 'rgba(139,26,26,0.4)';
    declineBtn.style.color = '#8B1A1A';
  }

  msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Simple confetti on RSVP accept
function confettiEffect() {
  const colors = ['#D4AF37', '#0B3B2C', '#e8cc6a', '#4caf50', '#fff', '#D4AF37'];
  const container = document.getElementById('particles-container');

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -10px;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        z-index: 9998;
        pointer-events: none;
        animation: confettiFall ${2 + Math.random() * 3}s ease forwards;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }, i * 50);
  }

  // Add keyframes if not already added
  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== Wishes / تهنئة =====
const wishes = [
  { name: 'أم العريس', text: 'بارك الله لكما وعليكما وجمع بينكما في خير 💛' },
  { name: 'صديق العائلة', text: 'ألف مبروك، ربنا يتمم عليكم بالخير ويرزقكم السعادة 🌿' },
];

function renderWishes() {
  const list = document.getElementById('wishesList');
  list.innerHTML = '';
  wishes.forEach(w => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-card-name"><i class="fas fa-leaf" style="color:var(--gold);margin-left:6px"></i>${w.name}</div>
      <div class="wish-card-text">${w.text}</div>
    `;
    list.appendChild(card);
  });
}

function sendWish() {
  const nameEl = document.getElementById('wishName');
  const textEl = document.getElementById('wishText');
  const name = nameEl.value.trim();
  const text = textEl.value.trim();

  if (!name || !text) {
    shakeElement(name ? textEl : nameEl);
    return;
  }

  wishes.unshift({ name, text });
  renderWishes();

  nameEl.value = '';
  textEl.value = '';

  // Success feedback
  const btn = document.querySelector('.wish-btn');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال!';
  btn.style.background = 'linear-gradient(135deg, #145233, #1a6b42)';
  btn.style.color = 'var(--gold)';
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.color = '';
  }, 2500);
}

function shakeElement(el) {
  el.style.animation = 'shake 0.4s ease';
  el.style.borderColor = '#e57373';
  el.focus();
  setTimeout(() => {
    el.style.animation = '';
    el.style.borderColor = '';
  }, 500);

  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== Seconds element transition =====
document.addEventListener('DOMContentLoaded', () => {
  const secEl = document.getElementById('seconds');
  if (secEl) {
    secEl.style.transition = 'transform 0.15s ease';
  }
  // Render initial wishes
  renderWishes();
});

// Expose globally for inline handlers
window.rsvp = rsvp;
window.sendWish = sendWish;
