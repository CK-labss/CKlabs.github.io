// ── DEFAULT DATA ────────────────────────────────────────────────────────────
const DEFAULT_COURSES = [
  { id:1, icon:"", bg:"accent-bg-1", c:"c-green",  name:"Introduction to Physics: Ancient Warfare",       meta:"8 weeks · All ages · In-person", tag:"tag-orange",  tagLabel:"Beginner"      },
];
 
const DEFAULT_EVENTS = [
  { id:1, day:"TBD", month:"TBD", name:"Introduction to Physics: Ancient Warfare",           detail:"TBD",        badge:"tag-orange",  badgeLabel:"Free"     },
];
 
// ── STORAGE ─────────────────────────────────────────────────────────────────
function loadData() {
  try {
    return {
      courses: JSON.parse(localStorage.getItem('ckl_courses')) ?? DEFAULT_COURSES,
      events:  JSON.parse(localStorage.getItem('ckl_events'))  ?? DEFAULT_EVENTS,
    };
  } catch { return { courses: DEFAULT_COURSES, events: DEFAULT_EVENTS }; }
}
 
// ── RENDER ───────────────────────────────────────────────────────────────────
function renderCourses(courses) {
  const list = document.getElementById('courses-list');
  if (!list) return;
  list.innerHTML = courses.map(c => `
    <div class="course-card">
      <div class="course-icon ${c.bg} ${c.c}">${c.icon}</div>
      <div class="course-info">
        <div class="course-name">${c.name}</div>
        <div class="course-meta">${c.meta}</div>
        <span class="course-tag ${c.tag}">${c.tagLabel}</span>
      </div>
    </div>`).join('');
}
 
function renderEvents(events) {
  const list = document.getElementById('schedule-list');
  if (!list) return;
  list.innerHTML = events.map(e => `
    <div class="schedule-event">
      <div class="event-date">
        <div class="event-day">${e.day}</div>
        <div class="event-month">${e.month}</div>
      </div>
      <div class="event-info">
        <div class="event-name">${e.name}</div>
        <div class="event-detail">${e.detail}</div>
      </div>
      <span class="event-badge ${e.badge}">${e.badgeLabel}</span>
    </div>`).join('');
}
 
// ── INIT ─────────────────────────────────────────────────────────────────────
const { courses, events } = loadData();
renderCourses(courses);
renderEvents(events);
 
// ── HERO CANVAS ──────────────────────────────────────────────────────────────
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, dots = [];
 
function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
 
function initDots() {
  dots = [];
  const spacing = 55;
  for (let x = 0; x < W + spacing; x += spacing)
    for (let y = 0; y < H + spacing; y += spacing)
      dots.push({ ox: x, oy: y, x, y,
        r: Math.random() * 1.1 + 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.35 + 0.12 });
}
 
function draw(t) {
  ctx.clearRect(0, 0, W, H);
  dots.forEach(d => {
    d.x = d.ox + Math.sin(t * d.speed + d.phase) * 7;
    d.y = d.oy + Math.cos(t * d.speed + d.phase * 1.3) * 6;
  });
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 72) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(41,184,216,${(1 - dist/72) * 0.28})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.stroke();
      }
    }
  }
  dots.forEach(d => {
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(41,184,216,0.5)';
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
 
window.addEventListener('resize', () => { resize(); initDots(); });
resize(); initDots();
requestAnimationFrame(draw);
 
// ── COUNTERS ─────────────────────────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const suffix = target === 96 ? '%' : '+';
    const duration = 1800, start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
 
const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { animateCounters(); obs.disconnect(); } }, { threshold: 0.3 });
obs.observe(document.querySelector('.stats-strip'));
