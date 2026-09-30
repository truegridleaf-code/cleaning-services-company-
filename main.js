/**
 * Truegrid Leaf - Main JavaScript
 * Production-Optimized Vanilla ES6+
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        const toggleMenu = (open) => {
            const state = typeof open === 'boolean' ? open : !hamburger.classList.contains('active');
            hamburger.classList.toggle('active', state);
            navMenu.classList.toggle('active', state);
            document.body.classList.toggle('menu-open', state);
        };
        hamburger.addEventListener('click', () => toggleMenu());
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) toggleMenu(false);
        });
    }

    // 2. Dropdown (Mobile Click / Desktop Hover via CSS)
    document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // 3. Optimized Scroll Handling (Passive + rAF)
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('scrollProgress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Sticky Header
                if (header) header.classList.toggle('scrolled', scrollY > 60);

                // Back to Top Button
                if (backToTop) backToTop.classList.toggle('show', scrollY > 400);

                // Scroll Progress
                if (progressBar) {
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    progressBar.style.width = maxScroll > 0 ? (scrollY / maxScroll * 100) + '%' : '0%';
                }

                // Active Nav Highlighting
                let currentId = '';
                sections.forEach(sec => {
                    const top = sec.offsetTop - 140;
                    if (scrollY >= top && scrollY < top + sec.clientHeight) {
                        currentId = sec.id;
                    }
                });
                if (currentId) {
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href') || '';
                        link.classList.toggle('active', href.endsWith('#' + currentId));
                    });
                }

                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 4. Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');

    if (heroSlides.length > 1) {
        let currentSlide = 0;
        let slideTimer = null;

        const showSlide = (idx) => {
            heroSlides[currentSlide].classList.remove('active');
            if (heroDots[currentSlide]) heroDots[currentSlide].classList.remove('active');
            currentSlide = (idx + heroSlides.length) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
            if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        const startTimer = () => { slideTimer = setInterval(nextSlide, 5000); };
        const resetTimer = () => { clearInterval(slideTimer); startTimer(); };

        startTimer();

        if (heroNext) heroNext.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if (heroPrev) heroPrev.addEventListener('click', () => { prevSlide(); resetTimer(); });
        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => { showSlide(i); resetTimer(); });
        });

        // Touch Swipe
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            let startX = 0;
            heroSlider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
            heroSlider.addEventListener('touchend', e => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                    diff > 0 ? nextSlide() : prevSlide();
                    resetTimer();
                }
            }, { passive: true });
        }
    }

    // 5. Stat Counter Animation (IntersectionObserver)
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsBar = document.querySelector('.stats-bar');
    if (statNumbers.length && statsBar) {
        const observer = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                statNumbers.forEach(counter => {
                    const target = parseInt(counter.dataset.count, 10) || 0;
                    const duration = 1800;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let val = 0;

                    const timer = setInterval(() => {
                        val += increment;
                        if (val >= target) {
                            counter.textContent = target.toLocaleString() + '+';
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(val).toLocaleString();
                        }
                    }, stepTime);
                });
                obs.disconnect();
            }
        }, { threshold: 0.25 });
        observer.observe(statsBar);
    }

    // 6. Service Filter (Works seamlessly on both index.html & services.html)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    if (filterBtns.length && serviceCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;

                serviceCards.forEach(card => {
                    const cat = card.dataset.category || '';
                    const match = filter === 'all' || cat.includes(filter);
                    if (match) {
                        card.style.display = '';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 30);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(15px)';
                        setTimeout(() => { card.style.display = 'none'; }, 200);
                    }
                });
            });
        });
    }

    // 7. Testimonial Slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const tDots = document.querySelectorAll('.t-dot');
    if (testimonialCards.length > 1) {
        let tIndex = 0;
        let tTimer = null;

        const showTestimonial = (idx) => {
            testimonialCards[tIndex].classList.remove('active');
            if (tDots[tIndex]) tDots[tIndex].classList.remove('active');
            tIndex = (idx + testimonialCards.length) % testimonialCards.length;
            testimonialCards[tIndex].classList.add('active');
            if (tDots[tIndex]) tDots[tIndex].classList.add('active');
        };

        tTimer = setInterval(() => showTestimonial(tIndex + 1), 5500);

        tDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showTestimonial(i);
                clearInterval(tTimer);
                tTimer = setInterval(() => showTestimonial(tIndex + 1), 5500);
            });
        });
    }

    // 8. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                faqItems.forEach(f => {
                    f.classList.remove('active');
                    const ans = f.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = null;
                });
                if (!wasActive) {
                    item.classList.add('active');
                    const ans = item.querySelector('.faq-answer');
                    if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
                }
            });
        }
    });

    // 9. Gallery Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (lightbox && lightboxImg && galleryItems.length) {
        const images = [];
        let lightboxIndex = 0;

        galleryItems.forEach((item, idx) => {
            const img = item.querySelector('img');
            if (img) images.push(img.src);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxIndex = idx;
                lightboxImg.src = images[lightboxIndex];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const changeLightbox = (dir) => {
            lightboxIndex = (lightboxIndex + dir + images.length) % images.length;
            lightboxImg.src = images[lightboxIndex];
        };

        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', () => changeLightbox(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeLightbox(1));
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightbox(-1);
            if (e.key === 'ArrowRight') changeLightbox(1);
        });
    }

    // 10. Quote Modal
    const quoteModal = document.getElementById('quoteModal');
    const quoteBtn = document.getElementById('quoteBtn');
    const modalClose = document.getElementById('modalClose');

    const toggleModal = (show) => {
        if (!quoteModal) return;
        quoteModal.classList.toggle('active', show);
        document.body.style.overflow = show ? 'hidden' : '';
    };

    if (quoteBtn) quoteBtn.addEventListener('click', (e) => { e.preventDefault(); toggleModal(true); });
    if (modalClose) modalClose.addEventListener('click', () => toggleModal(false));
    if (quoteModal) {
        quoteModal.addEventListener('click', (e) => { if (e.target === quoteModal) toggleModal(false); });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('active')) toggleModal(false);
    });

    // 11. Form Validation & Submissions
    const handleFormSubmit = (form, successMsg, callback) => {
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('[required]');
            let isValid = true;
            inputs.forEach(inp => {
                if (!inp.value.trim()) {
                    isValid = false;
                    inp.style.borderColor = '#ef4444';
                } else {
                    inp.style.borderColor = '';
                }
            });
            if (!isValid) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            const origText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            }

            setTimeout(() => {
                if (submitBtn) submitBtn.innerHTML = `<i class="fas fa-check"></i> ${successMsg}`;
                form.reset();
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = origText;
                        submitBtn.disabled = false;
                    }
                    if (callback) callback();
                }, 2000);
            }, 1000);
        });
    };

    handleFormSubmit(document.getElementById('contactForm'), 'Message Sent!');
    handleFormSubmit(document.getElementById('quoteForm'), 'Quote Requested!', () => toggleModal(false));
    document.querySelectorAll('.newsletter-form').forEach(form => handleFormSubmit(form, 'Subscribed!'));

    // 12. Cookie Consent
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieConsent.classList.add('show'), 2000);
        const accept = document.getElementById('acceptCookies');
        const decline = document.getElementById('declineCookies');
        if (accept) accept.addEventListener('click', () => { localStorage.setItem('cookieConsent', '1'); cookieConsent.classList.remove('show'); });
        if (decline) decline.addEventListener('click', () => { localStorage.setItem('cookieConsent', '0'); cookieConsent.classList.remove('show'); });
    }
});
