// ====== PRELOADER ======
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 800);
  }
});

// ====== NAVBAR SCROLL ======
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// ====== HAMBURGER MENU ======
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks?.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navLinks?.classList.remove('open');
  });
});

// ====== FADE-IN ON SCROLL ======
const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => observer.observe(el));

// ====== COUNTER ANIMATION ======
function animateCounter(el, target) {
  let current = 0;
  const duration = 1500;
  const startTime = performance.now();
  function update(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    current = Math.round(easeOut * target);
    el.textContent = current + '+';
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat h4[data-target]').forEach(el => statObserver.observe(el));

// ====== CATEGORY FILTER (STORE) ======
const filterBtns = document.querySelectorAll('.cat-filters button');
const products = document.querySelectorAll('.product-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    products.forEach(p => {
      p.style.display = (cat === 'all' || p.dataset.category === cat) ? 'block' : 'none';
    });
  });
});

// ====== SMOOTH CATEGORY SCROLL (RESTO) ======
document.querySelectorAll('.resto-nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.resto-nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
