const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

navToggle?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 },
);

sections.forEach((section) => observer.observe(section));

const canvas = document.getElementById("signal-canvas");
const context = canvas?.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let animationFrame = 0;
let points = [];

function resizeCanvas() {
  if (!canvas || !context) return;
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
  points = Array.from({ length: Math.min(74, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    speed: 0.18 + Math.random() * 0.42,
    length: 36 + Math.random() * 90,
    hue: Math.random() > 0.5 ? "cyan" : "magenta",
  }));
}

function drawSignals() {
  if (!canvas || !context) return;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  context.lineWidth = 1;

  points.forEach((point) => {
    const gradient = context.createLinearGradient(point.x, point.y, point.x + point.length, point.y);
    if (point.hue === "cyan") {
      gradient.addColorStop(0, "rgba(37, 217, 255, 0)");
      gradient.addColorStop(1, "rgba(37, 217, 255, 0.28)");
    } else {
      gradient.addColorStop(0, "rgba(255, 61, 184, 0)");
      gradient.addColorStop(1, "rgba(255, 61, 184, 0.24)");
    }

    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + point.length, point.y);
    context.stroke();

    point.x += point.speed;
    if (point.x > window.innerWidth + point.length) {
      point.x = -point.length;
      point.y = Math.random() * window.innerHeight;
    }
  });

  if (!prefersReducedMotion.matches) {
    animationFrame = requestAnimationFrame(drawSignals);
  }
}

resizeCanvas();
drawSignals();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawSignals();
});

prefersReducedMotion.addEventListener("change", () => {
  cancelAnimationFrame(animationFrame);
  drawSignals();
});
