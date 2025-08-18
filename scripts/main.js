// Убрано - объединено в основной DOMContentLoaded

// Header state on scroll
const header = document.querySelector('.site-header');
const setHeaderState = () => {
  if (!header) return;
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

// Advanced reveal animations with stagger
const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        // Add stagger delay for cards
        const isCard = entry.target.classList.contains('card');
        const cards = entry.target.parentElement?.querySelectorAll('.card');
        if (isCard && cards) {
          const index = Array.from(cards).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 150);
        } else {
          entry.target.classList.add('is-visible');
        }
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15, rootMargin: '-50px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Parallax for imagery
const parallaxWrappers = Array.from(document.querySelectorAll('[data-parallax]'));
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const handleParallax = () => {
  const viewportH = window.innerHeight || 0;
  for (const wrap of parallaxWrappers) {
    const img = wrap.querySelector('img');
    if (!img) continue;
    const rect = wrap.getBoundingClientRect();
    const centerProgress = (viewportH / 2 - (rect.top + rect.height / 2)) / viewportH; // -1..1
    const translate = clamp(centerProgress * 24, -24, 24); // px
    img.style.transform = `translateY(${translate}px)`;
  }
};
handleParallax();
window.addEventListener('scroll', handleParallax, { passive: true });
window.addEventListener('resize', handleParallax);

// Magnetic effect for buttons
const magneticEls = Array.from(document.querySelectorAll('.btn, .card'));
magneticEls.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxDistance = 20;
    const distance = Math.sqrt(x * x + y * y);
    
    if (distance < 100) {
      const factor = Math.min(1, (100 - distance) / 100);
      const moveX = (x / rect.width) * maxDistance * factor;
      const moveY = (y / rect.height) * maxDistance * factor;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// Cursor glow effect
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Mobile navigation toggle
const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav');
const body = document.body;

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('active');
    
    if (isOpen) {
      nav.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    } else {
      nav.classList.add('active');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
    }
  });

  // Close menu when clicking on nav links
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  });
}

// 🔥 КРУТЫЕ ФИЧИ БЕЗ НАВИГАЦИИ (навигация теперь в smart-navigation.js)
console.log('🚀 ЗАГРУЖАЕМ КРУТЫЕ ФИЧИ (БЕЗ НАВИГАЦИИ)!');

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM загружен - подключаем фичи БЕЗ навигации');
  
  // 1. LOADING STATES
  document.body.classList.add('loading');
  setTimeout(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, 100);
  
  // 2. YEAR IN FOOTER
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  
  // 3. SECTION ANIMATIONS
  const sections = document.querySelectorAll('.section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  console.log('✅ ФИЧИ ГОТОВЫ (навигация управляется SmartNavigation)!');
});

// 🌟 Advanced reveal animations with stagger (уже есть выше)

// 🌊 Parallax for imagery (уже есть выше)

// 🧲 Magnetic effect for buttons (уже есть выше)

// ✨ Cursor glow effect (уже есть выше)

// 🃏 Brand Cards 3D Effects
const brandCards = document.querySelectorAll('.brand-card');
brandCards.forEach(card => {
  const overlay = card.querySelector('.brand-card__overlay');
  
  card.addEventListener('mouseenter', function() {
    // 3D hover effect
    card.style.transform = 'translateY(-8px) rotateX(5deg)';
    card.style.boxShadow = '0 20px 40px rgba(247, 233, 142, 0.3)';
    
    // Animate stats if they exist
    if (overlay) {
      const stats = overlay.querySelectorAll('.stat__number');
      stats.forEach((stat, index) => {
        setTimeout(() => {
          stat.style.transform = 'scale(1.1)';
          stat.style.color = '#f7e98e';
        }, index * 50);
      });
    }
  });
  
  card.addEventListener('mouseleave', function() {
    card.style.transform = '';
    card.style.boxShadow = '';
    
    if (overlay) {
      const stats = overlay.querySelectorAll('.stat__number');
      stats.forEach(stat => {
        stat.style.transform = '';
        stat.style.color = '';
      });
    }
  });
  
  // Mobile tap interaction
  card.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      
      const isActive = card.classList.contains('active');
      brandCards.forEach(c => c.classList.remove('active'));
      
      if (!isActive) {
        card.classList.add('active');
      }
    }
  });
});

// НАВИГАЦИЯ ОТКЛЮЧЕНА - управляется SmartNavigation классом

// МОБИЛЬНОЕ МЕНЮ ОТКЛЮЧЕНО - управляется SmartNavigation классом

// Fixed scroll performance with navigation
let ticking = false;

function updateOnScroll() {
  setHeaderState();
  handleParallax();
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}

// Remove old scroll listeners and add the new one
window.removeEventListener('scroll', setHeaderState);
window.removeEventListener('scroll', handleParallax);
window.addEventListener('scroll', requestTick, { passive: true });

// Enhanced UX: Add visual feedback for interactions
document.addEventListener('DOMContentLoaded', () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add hover sound effect (visual feedback)
  const interactiveElements = document.querySelectorAll('.btn, .card, .nav a, .brand');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      this.style.setProperty('--hover-scale', '1.02');
    });
    
    el.addEventListener('mouseleave', function() {
      this.style.removeProperty('--hover-scale');
    });
  });
  
  // Enhanced scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  document.body.appendChild(scrollIndicator);
  
  function updateScrollIndicator() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollIndicator.style.width = scrolled + '%';
  }
  
  window.addEventListener('scroll', updateScrollIndicator, { passive: true });
  
  // Add active section indicator to navigation
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  const sections = document.querySelectorAll('.section[id]');
  
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // Simplified Brand Cards Interactions
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach(card => {
    const overlay = card.querySelector('.brand-card__overlay');
    
    card.addEventListener('mouseenter', function() {
      // Simple hover effect - no crazy 3D transforms
      card.style.transform = 'translateY(-4px)';
      
      // Animate stats if they exist
      if (overlay) {
        const stats = overlay.querySelectorAll('.stat__number');
        stats.forEach((stat, index) => {
          setTimeout(() => {
            stat.style.transform = 'scale(1.05)';
            stat.style.color = '#f7e98e';
          }, index * 50);
        });
      }
    });
    
    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
      
      if (overlay) {
        const stats = overlay.querySelectorAll('.stat__number');
        stats.forEach(stat => {
          stat.style.transform = '';
          stat.style.color = '';
        });
      }
    });
    
    // Mobile tap interaction
    card.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        
        const isActive = card.classList.contains('active');
        brandCards.forEach(c => c.classList.remove('active'));
        
        if (!isActive) {
          card.classList.add('active');
        }
      }
    });
  });
  
  // Brand cards stagger animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '-50px'
  };
  
  const brandCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.brand-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 200);
        });
        brandCardsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  const brandsGrid = document.querySelector('.brands-grid');
  if (brandsGrid) {
    // Initially hide cards
    const cards = brandsGrid.querySelectorAll('.brand-card');
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.8s cubic-bezier(.23,1,.32,1)';
    });
    
    brandCardsObserver.observe(brandsGrid);
  }
});


