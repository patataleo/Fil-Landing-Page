document.addEventListener('DOMContentLoaded', function() {
    console.log('Filó website loaded successfully');
    
    // Initialize VanillaTilt for contact cards
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('.contact-card');
        VanillaTilt.init(tiltElements, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.5,
            scale: 1.05
        });
        console.log('VanillaTilt initialized for contact cards');
    }

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('#overview, #about, #contact');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation state based on scroll position
    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 150; // Offset for better UX
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNav);
    
    // Set initial active state
    updateActiveNav();

    // Search functionality (placeholder)
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('Search clicked - functionality to be implemented');
            // TODO: Implement search functionality
        });
    }

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksEl = document.getElementById('primary-navigation');
    if (navToggle && navLinksEl) {
        function setMenu(open) {
            if (open) {
                navLinksEl.classList.add('open');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            } else {
                navLinksEl.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
        let isOpen = false;
        navToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            setMenu(isOpen);
        });
        // Close on link click
        navLinksEl.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                isOpen = false;
                setMenu(false);
            });
        });
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                isOpen = false;
                setMenu(false);
            }
        });
    }

    // Contact card interactions
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const icon = this.querySelector('.contact-icon');
            const text = icon.textContent;
            
            if (text === 'location_on') {
                console.log('Location card clicked');
                // TODO: Implement location functionality
            } else if (text === 'phone') {
                console.log('Phone card clicked');
                // TODO: Implement phone functionality
            } else if (text === 'email') {
                console.log('Email card clicked');
                // TODO: Implement email functionality
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close any open modals/overlays
        if (e.key === 'Escape') {
            console.log('ESC pressed - closing any open overlays');
            // TODO: Implement overlay closing functionality
        }
    });

    // Performance optimization: Throttle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNav, 10);
    });

    console.log('All event listeners initialized');

    // Scroll-linked animations
    const productOverlay = document.querySelector('.product-overlay-image');
    const kioskImage = document.querySelector('.kiosk-image');
    const sectionTitles = document.querySelectorAll('.section-title');
    const cards = document.querySelectorAll('.contact-card');
    const brandRows = document.querySelectorAll('.brand-text-row');
    // About section targets
    const aboutLogo = document.querySelector('.about-brand-logo');
    const aboutDesc = document.querySelector('.about-description');
    const aboutBg = document.querySelector('.about-background');
    const aboutImgs = document.querySelectorAll('.about-images img');

    // Utility: compute 0..1 visibility progress within viewport with margins
    function viewportProgress(el, topMargin = 0.15, bottomMargin = 0.15) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const start = vh * (1 - bottomMargin);
        const end = vh * topMargin;
        const total = start - end;
        const p = (start - rect.top) / (total || 1);
        return Math.max(0, Math.min(1, p));
    }

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
    function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }

    function rafLoop() {
        // Product overlay: pop scale + slight rise
        if (productOverlay) {
            const p = easeOutCubic(viewportProgress(productOverlay, 0.2, 0.2));
            const scale = 0.96 + 0.04 * p;
            const ty = 20 * (1 - p);
            productOverlay.style.setProperty('--pop-scale', scale.toFixed(3));
            productOverlay.style.setProperty('--pop-ty', `${ty.toFixed(1)}px`);
            productOverlay.style.opacity = String(p);
        }

        // Kiosk: pan from right 40px -> 0 and fade in
        if (kioskImage) {
            const p = easeOutQuad(viewportProgress(kioskImage, 0.25, 0.2));
            const tx = 40 * (1 - p);
            kioskImage.style.setProperty('--pan-tx', `${tx.toFixed(1)}px`);
            kioskImage.style.opacity = String(p);
        }

        // Titles fade in
        sectionTitles.forEach(el => {
            const p = viewportProgress(el, 0.3, 0.3);
            el.style.opacity = String(p);
        });

        // Contact cards: subtle pop
        cards.forEach(el => {
            const p = easeOutCubic(viewportProgress(el, 0.25, 0.25));
            const scale = 0.97 + 0.03 * p;
            el.style.transform = `scale(${scale.toFixed(3)})`;
            el.style.opacity = String(p);
        });

        // Brand rows: fade
        brandRows.forEach(el => {
            const p = viewportProgress(el, 0.3, 0.3);
            el.style.opacity = String(p);
        });

        // About: brand logo gentle rise + fade (compose via CSS var, keep centering)
        if (aboutLogo) {
            const p = easeOutCubic(viewportProgress(aboutLogo, 0.25, 0.25));
            const ty = 20 * (1 - p);
            aboutLogo.style.opacity = String(p);
            aboutLogo.style.setProperty('--about-logo-ty', `${ty.toFixed(1)}px`);
        }

        // About: description soft rise + fade (compose via CSS var, keep centering)
        if (aboutDesc) {
            const p = easeOutCubic(viewportProgress(aboutDesc, 0.25, 0.25));
            const ty = 16 * (1 - p);
            aboutDesc.style.opacity = String(p);
            aboutDesc.style.setProperty('--about-desc-ty', `${ty.toFixed(1)}px`);
        }

        // About: background - no animation per request

        // About: images subtle pop + fade
        aboutImgs.forEach((img, idx) => {
            const pBase = viewportProgress(img, 0.25, 0.25);
            // small stagger
            const p = Math.max(0, Math.min(1, pBase - idx * 0.05));
            const scale = 0.97 + 0.03 * easeOutCubic(p);
            img.style.transform = `scale(${scale.toFixed(3)})`;
            img.style.opacity = String(p);
        });

        requestAnimationFrame(rafLoop);
    }

    // Initialize base states
    if (productOverlay) {
        productOverlay.style.setProperty('--pop-scale', '0.96');
        productOverlay.style.setProperty('--pop-ty', '20px');
        productOverlay.style.opacity = '0';
    }
    if (kioskImage) {
        kioskImage.style.setProperty('--pan-tx', '40px');
        kioskImage.style.opacity = '0';
    }
    sectionTitles.forEach(el => { el.style.opacity = '0'; });
    cards.forEach(el => { el.style.opacity = '0'; el.style.transformOrigin = 'center'; });
    brandRows.forEach(el => { el.style.opacity = '0'; });

    requestAnimationFrame(rafLoop);
});
