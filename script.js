document.addEventListener('DOMContentLoaded', () => {
  
  // --- Sticky Header ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close menu when clicking a link
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });

  // --- Scroll Reveal with IntersectionObserver ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      
      // Optional stagger effect if multiple items enter at once
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80); // 80ms stagger
      
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Tabs Logic ---
  const tabBtns = document.querySelectorAll('.tabs__btn');
  const tabPanes = document.querySelectorAll('.tabs__pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      // Add active to clicked
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // --- Carousel Logic ---
  const carousel = document.getElementById('carousel');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  const dotsContainer = document.querySelector('.carousel__dots');
  
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel__slide');
    const slideWidth = slides[0].getBoundingClientRect().width;
    
    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        carousel.scrollTo({
          left: slides[index].offsetLeft - carousel.offsetLeft,
          behavior: 'smooth'
        });
        updateDots(index);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateDots = (activeIndex) => {
      dots.forEach(dot => dot.classList.remove('active'));
      if(dots[activeIndex]) dots[activeIndex].classList.add('active');
    };

    // Scroll buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
      });
    }

    // Update active dot on scroll
    carousel.addEventListener('scroll', () => {
      const scrollPosition = carousel.scrollLeft;
      const index = Math.round(scrollPosition / slideWidth);
      updateDots(index);
    });

    // Optional Drag to scroll (Desktop)
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'default';
    });
    
    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'default';
    });
    
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      carousel.scrollLeft = scrollLeft - walk;
    });
  }

});
