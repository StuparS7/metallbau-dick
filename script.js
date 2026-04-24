const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  const normalizePath = (pathname) => {
    if (pathname.endsWith('/index.html')) {
      return pathname.slice(0, -'/index.html'.length) || '/';
    }

    if (pathname.endsWith('/')) {
      return pathname.slice(0, -1) || '/';
    }

    return pathname;
  };

  const currentPath = normalizePath(window.location.pathname);

  menu.querySelectorAll('a').forEach((link) => {
    const linkPath = normalizePath(new URL(link.href).pathname);
    if (linkPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!prefersReducedMotion && supportsFinePointer) {
  const tiltSurfaces = document.querySelectorAll(
    '.hero-copy, .hero-media, .card, .page-panel, .map-wrap, .iso-card'
  );

  tiltSurfaces.forEach((surface) => {
    const setPointer = (event) => {
      const rect = surface.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      surface.style.setProperty('--mx', x.toFixed(3));
      surface.style.setProperty('--my', y.toFixed(3));
    };

    const resetPointer = () => {
      surface.style.setProperty('--mx', '0.5');
      surface.style.setProperty('--my', '0.5');
    };

    surface.addEventListener('pointermove', setPointer);
    surface.addEventListener('pointerenter', setPointer);
    surface.addEventListener('pointerleave', resetPointer);
  });

  const emitSparks = (button) => {
    const sparks = 7;

    for (let index = 0; index < sparks; index += 1) {
      const spark = document.createElement('span');
      spark.className = 'spark-particle';

      const angle = Math.random() * Math.PI * 2;
      const distance = 18 + Math.random() * 30;
      const xOffset = Math.cos(angle) * distance;
      const yOffset = Math.sin(angle) * distance - 8;

      spark.style.setProperty('--dx', `${xOffset.toFixed(1)}px`);
      spark.style.setProperty('--dy', `${yOffset.toFixed(1)}px`);
      spark.style.setProperty('--rot', `${(Math.random() * 120 - 60).toFixed(1)}deg`);
      spark.style.left = `${68 + Math.random() * 12}%`;
      spark.style.top = `${36 + Math.random() * 30}%`;
      spark.classList.add('is-active');

      spark.addEventListener(
        'animationend',
        () => {
          spark.remove();
        },
        { once: true }
      );

      button.appendChild(spark);
    }
  };

  document.querySelectorAll('.btn-primary').forEach((button) => {
    let lastBurst = 0;

    const burst = () => {
      const now = performance.now();
      if (now - lastBurst < 220) {
        return;
      }

      lastBurst = now;
      emitSparks(button);
    };

    button.addEventListener('pointerenter', burst);
    button.addEventListener('pointerdown', burst);
  });
}
