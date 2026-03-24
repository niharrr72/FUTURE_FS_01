/* ============================================
   NIHAR RANJAN ROUTRAY - PORTFOLIO JS
   ============================================ */

'use strict';

// ===== TYPEWRITER EFFECT =====
const typewriterTexts = [
  'Full Stack Apps',
  'React Frontends',
  'Node.js Backends',
  'Real-World Solutions',
  'Elegant Interfaces',
];
let typeIdx = 0, charIdx = 0, isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function typeWriter() {
  if (!typewriterEl) return;
  const currentText = typewriterTexts[typeIdx];
  if (isDeleting) {
    charIdx--;
    typewriterEl.textContent = currentText.slice(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      typeIdx = (typeIdx + 1) % typewriterTexts.length;
      setTimeout(typeWriter, 400);
    } else {
      setTimeout(typeWriter, 60);
    }
  } else {
    charIdx++;
    typewriterEl.textContent = currentText.slice(0, charIdx);
    if (charIdx === currentText.length) {
      isDeleting = true;
      setTimeout(typeWriter, 1800);
    } else {
      setTimeout(typeWriter, 90);
    }
  }
}
document.addEventListener('DOMContentLoaded', () => setTimeout(typeWriter, 1500));


// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  handleBackToTop();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight);
    }
  });
}


// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
function handleBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


// ===== SCROLL ANIMATIONS (Intersection Observer) =====
const animateEls = document.querySelectorAll(
  '.section-header, .about-grid, .stats-row, .skills-grid, .projects-grid, .contact-grid, .project-card, .skill-category, .stat-card, .contact-card'
);

animateEls.forEach(el => el.classList.add('animate-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => observer.observe(el));


// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
    if (current >= target) {
      el.textContent = target + (target === 100 ? '%' : '+');
      clearInterval(timer);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) counterObserver.observe(statsRow);


// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';

    // Web3Forms integration for direct email delivery
    try {
      const formData = new FormData(contactForm);
      // Enhance the payload with some nice formatting
      formData.append("subject", `Portfolio Contact: ${subject}`);
      formData.append("from_name", name);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        showFormStatus('🎉 Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } else {
        if (data.message && data.message.includes("Invalid Access Key")) {
           showFormStatus('⚠️ Almost there! Please replace YOUR_ACCESS_KEY_HERE in index.html with your Web3Forms key.', 'error');
        }
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (err) {
      // Fallback: open default mail client if API fails or key is missing
      const mailtoLink = `mailto:niharroutray72@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      window.open(mailtoLink);
      if (!err.message || !err.message.includes("Invalid Access Key")) {
        showFormStatus('✅ Opening your email client instead!', 'success');
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
    }
  });
}

function showFormStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  setTimeout(() => {
    formStatus.className = 'form-status';
    formStatus.textContent = '';
  }, 6000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ===== PROFILE IMAGE FALLBACK =====
const profileImgs = document.querySelectorAll('.hero-photo, .about-photo');
profileImgs.forEach(img => {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    const parent = this.parentElement;
    const initials = document.createElement('div');
    initials.style.cssText = `
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #6C63FF, #00D9FF);
      font-family: 'Poppins', sans-serif;
      font-size: 5rem; font-weight: 800;
      color: white; letter-spacing: -2px;
    `;
    initials.textContent = 'NR';
    parent.appendChild(initials);
  });
});


// ===== SMOOTH HOVER PARALLAX on hero image =====
const heroCard = document.querySelector('.hero-image-card');
if (heroCard) {
  heroCard.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  });
  heroCard.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
  });
}


// ===== PROJECT CARDS STAGGER =====
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});

const skillCats = document.querySelectorAll('.skill-category');
skillCats.forEach((cat, i) => {
  cat.style.transitionDelay = `${i * 60}ms`;
});


// ===== UNDERWATER BUBBLES GENERATOR =====
function createBubbles() {
  const container = document.getElementById('bubbles-container');
  if (!container) return;
  
  const bubbleCount = 20;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('span');
    bubble.classList.add('bubble');
    
    // Randomize properties for organic look
    const size = Math.random() * 20 + 5; // 5px to 25px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 8 + 6; // 6s to 14s
    const delay = Math.random() * 5; // 0s to 5s
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    
    container.appendChild(bubble);
  }
}
document.addEventListener('DOMContentLoaded', createBubbles);

// ===== INTERACTIVE BACKGROUND RIPPLES =====
const rippleTargets = document.querySelectorAll('.project-card, .about-photo, .hero-image-card');
const bgContainer = document.querySelector('.underwater-bg');

let rippleInterval;

rippleTargets.forEach(target => {
  target.addEventListener('mouseenter', () => {
    // Single initial ripple
    if(bgContainer) createHoverRipple(target);
    
    // Spawn ripples continuously while hovering
    rippleInterval = setInterval(() => {
      if(bgContainer) createHoverRipple(target);
    }, 1000); 
  });
  
  target.addEventListener('mouseleave', () => {
    clearInterval(rippleInterval);
  });
});

function createHoverRipple(target) {
  const rect = target.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.classList.add('hover-bg-ripple');
  
  // Exactly at the center of the hovered element
  const viewportX = rect.left + (rect.width / 2);
  const viewportY = rect.top + (rect.height / 2);
  
  ripple.style.left = `${viewportX}px`;
  ripple.style.top = `${viewportY}px`;
  
  // Slower flowing ripples (like before) but spaced 1 second apart
  const duration = 8.0; 
  ripple.style.animationDuration = `${duration}s`;
  
  bgContainer.appendChild(ripple);
  
  // Cleanup DOM after animation
  setTimeout(() => {
    ripple.remove();
  }, duration * 1000);
}
