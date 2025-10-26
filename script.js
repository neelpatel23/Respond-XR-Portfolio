/**
 * Respond XR Portfolio Website
 * Interactive JavaScript functionality
 * 
 * Features:
 * - Smooth scrolling navigation
 * - Mobile menu toggle
 * - Scroll-triggered animations
 * - Gallery filtering
 * - Performance optimizations
 * - Accessibility enhancements
 */

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls to once per specified time
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
  
  return (vertInView && horInView);
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(targetElement, offset = 80) {
  const targetPosition = targetElement.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;
  let start = null;

  function animation(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// ===========================
// MAIN APPLICATION CLASS
// ===========================

class ResponderXRApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupApp());
    } else {
      this.setupApp();
    }
  }

  setupApp() {
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupAnimations();
    this.setupGallery();
    this.setupDemo();
    this.setupFeatureCards();
    this.setupPerformanceOptimizations();
    this.setupAccessibility();
    
    // Initialize scroll-based features
    this.handleScroll();
    
    console.log('Respond XR Portfolio initialized successfully');
  }

  // ===========================
  // NAVIGATION FUNCTIONALITY
  // ===========================

  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          smoothScrollTo(targetElement);
          
          // Update active nav link
          navLinks.forEach(nl => nl.classList.remove('active'));
          link.classList.add('active');
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });

    // Handle scroll-based navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const highlightNavigation = throttle(() => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, 100);

    window.addEventListener('scroll', highlightNavigation);
  }

  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        navbar.classList.toggle('menu-open');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
    }
  }

  closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');

    if (navLinks) navLinks.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    if (navbar) navbar.classList.remove('menu-open');
  }

  // ===========================
  // SCROLL EFFECTS
  // ===========================

  setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset;
      
      // Navbar background on scroll
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Trigger scroll animations
      this.handleScrollAnimations();
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll);
  }

  handleScroll() {
    this.handleScrollAnimations();
  }

  handleScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animate]');
    
    animateElements.forEach(element => {
      if (isInViewport(element, 0.1) && !element.classList.contains('animated')) {
        const animationType = element.dataset.animate || 'fadeInUp';
        element.classList.add('animated', animationType);
      }
    });
  }

  // ===========================
  // ANIMATIONS
  // ===========================

  setupAnimations() {
    // Add scroll animation attributes to elements
    const elementsToAnimate = [
      '.stat-card',
      '.feature-card',
      '.tech-item',
      '.metric-card',
      '.team-member',
      '.impact-card',
      '.testimonial-card'
    ];

    elementsToAnimate.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        element.setAttribute('data-animate', 'fadeInUp');
        element.style.animationDelay = `${index * 100}ms`;
      });
    });

    // Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    }
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated', 'fadeInUp');
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach(element => {
      observer.observe(element);
    });
  }

  // ===========================
  // GALLERY FUNCTIONALITY
  // ===========================

  setupGallery() {
    const galleryNav = document.querySelectorAll('.gallery-nav-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryNav.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Update active button
        galleryNav.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter gallery items
        galleryItems.forEach(item => {
          const itemCategory = item.dataset.category;
          
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.classList.add('fadeIn');
          } else {
            item.style.display = 'none';
            item.classList.remove('fadeIn');
          }
        });
      });
    });
  }

  // ===========================
  // DEMO VIDEO FUNCTIONALITY
  // ===========================

  setupDemo() {
    const demoVideo = document.getElementById('demo-video');
    
    if (demoVideo) {
      demoVideo.addEventListener('click', () => {
        // In a real implementation, this would embed the actual YouTube video
        // For now, we'll show a placeholder interaction
        this.handleDemoVideoClick();
      });
    }
  }

  handleDemoVideoClick() {
    const videoWrapper = document.querySelector('.video-wrapper');
    const overlay = document.querySelector('.video-overlay');
    
    // Add loading state
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <h3>Loading Demo Video...</h3>
      <p>Please wait while we load the demonstration</p>
    `;
    
    // Simulate video loading
    setTimeout(() => {
      overlay.innerHTML = `
        <div class="video-loaded">
          <h3>Demo Video Would Play Here</h3>
          <p>In production, this would embed the actual YouTube video</p>
          <p>Video URL: https://youtube.com/watch?v=[demo-video-id]</p>
        </div>
      `;
    }, 1500);
  }

  // ===========================
  // FEATURE CARDS INTERACTION
  // ===========================

  setupFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
      
      card.addEventListener('click', () => {
        const feature = card.dataset.feature;
        this.handleFeatureCardClick(feature, card);
      });
    });
  }

  handleFeatureCardClick(feature, cardElement) {
    // Remove active state from all cards
    document.querySelectorAll('.feature-card').forEach(card => {
      card.classList.remove('active');
    });
    
    // Add active state to clicked card
    cardElement.classList.add('active');
    
    // Log interaction (in production, this might track analytics)
    console.log(`Feature card clicked: ${feature}`);
    
    // Animate the card
    cardElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
      cardElement.style.transform = '';
    }, 200);
  }

  // ===========================
  // PERFORMANCE OPTIMIZATIONS
  // ===========================

  setupPerformanceOptimizations() {
    // Lazy loading for images
    this.setupLazyLoading();
    
    // Preload critical images
    this.preloadCriticalImages();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
    }
  }

  preloadCriticalImages() {
    const criticalImages = [
      'images/app-hero-screenshot.png',
      'images/demo-thumbnail.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  optimizeScrollPerformance() {
    // Use passive event listeners for scroll events
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    scrollElements.forEach(element => {
      element.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    });
  }

  // ===========================
  // ACCESSIBILITY ENHANCEMENTS
  // ===========================

  setupAccessibility() {
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Focus management
    this.setupFocusManagement();
    
    // ARIA updates
    this.setupAriaUpdates();
    
    // Reduced motion support
    this.setupReducedMotionSupport();
  }

  setupKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            element.click();
          }
        }
      });
    });
  }

  setupFocusManagement() {
    // Focus trap for mobile menu
    const navbar = document.getElementById('navbar');
    const firstFocusableElement = navbar.querySelector('a, button');
    const lastFocusableElement = navbar.querySelector('.nav-button');
    
    navbar.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  setupAriaUpdates() {
    const galleryNav = document.querySelectorAll('.gallery-nav-btn');
    
    galleryNav.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update aria-pressed for gallery filter buttons
        galleryNav.forEach(b => {
          b.setAttribute('aria-pressed', 'false');
        });
        btn.setAttribute('aria-pressed', 'true');
      });
    });
  }

  setupReducedMotionSupport() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      // Disable animations for users who prefer reduced motion
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }
}

// ===========================
// ERROR HANDLING
// ===========================

window.addEventListener('error', (event) => {
  console.error('JavaScript error:', event.error);
  // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you might want to send this to an error tracking service
});

// ===========================
// INITIALIZATION
// ===========================

// Initialize the application
const app = new ResponderXRApp();

// ===========================
// ADDITIONAL CSS ANIMATIONS
// ===========================

// Add CSS for JavaScript-triggered animations
const style = document.createElement('style');
style.textContent = `
  .fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
  
  .fadeInUp {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  .lazy.loaded {
    opacity: 1;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(220, 38, 38, 0.3);
    border-top: 3px solid #dc2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .navbar.scrolled {
    background: rgba(11, 18, 32, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
  
  .feature-card.hovered {
    transform: translateY(-5px) scale(1.02);
  }
  
  .feature-card.active {
    border-color: #dc2626;
    box-shadow: 0 20px 40px rgba(220, 38, 38, 0.2);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      position: fixed;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(11, 18, 32, 0.98);
      backdrop-filter: blur(10px);
      flex-direction: column;
      padding: 2rem;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    
    .nav-links.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }
    
    .nav-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;

document.head.appendChild(style);

// ===========================
// UTILITY EXPORTS (if needed)
// ===========================

// Export utility functions for potential use by other scripts
window.ResponderXRUtils = {
  debounce,
  throttle,
  isInViewport,
  smoothScrollTo
};
