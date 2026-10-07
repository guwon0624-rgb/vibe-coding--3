const menuButton = document.querySelector(".menu-toggle");
const menuLinks = document.querySelectorAll(".main-nav a");
const year = document.querySelector("#year");
const glow = document.querySelector(".cursor-glow");
const sections = document.querySelectorAll(".content-section");
const heroSlides = document.querySelectorAll(".hero-slide");
const slideButtons = document.querySelectorAll(".slide-indicators button");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let currentSlide = 0;
let slideTimer;

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "메뉴 열기");
}

menuButton.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

year.textContent = new Date().getFullYear();

function showSlide(index) {
  heroSlides[currentSlide].classList.remove("is-active");
  slideButtons[currentSlide].classList.remove("is-active");
  slideButtons[currentSlide].removeAttribute("aria-current");

  currentSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides[currentSlide].classList.add("is-active");
  slideButtons[currentSlide].classList.add("is-active");
  slideButtons[currentSlide].setAttribute("aria-current", "true");
}

function startSlideshow() {
  window.clearInterval(slideTimer);
  slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 5500);
}

slideButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    showSlide(index);
    if (!reduceMotion.matches) startSlideshow();
  });
});

if (!reduceMotion.matches) {
  startSlideshow();
  sections.forEach((section) => section.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  sections.forEach((section) => revealObserver.observe(section));

  document.querySelectorAll(".skill-list span").forEach((skill, index) => {
    skill.style.transitionDelay = `${index * 45}ms`;
  });

  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(slideTimer);
    } else {
      startSlideshow();
    }
  });
}
