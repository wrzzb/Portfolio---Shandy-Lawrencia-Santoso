/* ===========================================================
   script.js — portfolio interactivity
   1) Interactive starfield (stars drift away from the cursor)
   2) Character blink every ~3s (toggles a class your CSS can hook)
   3) Scroll-spy for the sticky nav (highlights current section)
=========================================================== */

/* ---------- 1. Starfield ---------- */
const canvas = document.getElementById("star-canvas");
const ctx = canvas.getContext("2d");

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const STAR_COUNT = 140;
const stars = [];

function makeStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    baseX: 0, // set below
    baseY: 0,
    radius: Math.random() * 1.6 + 0.4,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
    vx: 0,
    vy: 0,
  };
}

for (let i = 0; i < STAR_COUNT; i++) {
  const s = makeStar();
  s.baseX = s.x;
  s.baseY = s.y;
  stars.push(s);
}

const mouse = { x: -9999, y: -9999 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 2.2;
const RETURN_SPEED = 0.04;

function animateStars(time) {
  ctx.clearRect(0, 0, width, height);

  for (const s of stars) {
    // push away from the cursor
    const dx = s.x - mouse.x;
    const dy = s.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REPEL_RADIUS) {
      const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
      s.vx += (dx / (dist || 1)) * force * REPEL_STRENGTH;
      s.vy += (dy / (dist || 1)) * force * REPEL_STRENGTH;
    }

    // ease back toward original position
    s.vx += (s.baseX - s.x) * RETURN_SPEED * 0.05;
    s.vy += (s.baseY - s.y) * RETURN_SPEED * 0.05;

    // damping
    s.vx *= 0.9;
    s.vy *= 0.9;

    s.x += s.vx;
    s.y += s.vy;

    // twinkle
    const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase);
    const alpha = 0.3 + twinkle * 0.7;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = "rgba(255, 168, 224, 0.8)";
    ctx.shadowBlur = 4;
    ctx.fill();
  }

  requestAnimationFrame(animateStars);
}
requestAnimationFrame(animateStars);

/* ---------- 2. Character blink ---------- */
const character = document.querySelector(".hero-character");
if (character) {
  setInterval(() => {
    character.classList.add("blink");
    setTimeout(() => character.classList.remove("blink"), 180);
  }, 3000);
}

/* ---------- 3. Scroll-spy nav highlighting ---------- */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function onScroll() {
  let current = sections[0]?.id;
  const scrollPos = window.scrollY + window.innerHeight * 0.35;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", onScroll);
onScroll();