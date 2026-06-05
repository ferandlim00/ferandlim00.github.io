/* ============================================================
   FERNANDOZ LIM PORTFOLIO — script.js
   Features: Loading, Particles, Typed.js, Hamburger, AOS,
             Back-to-top, Nav scroll, Contact form, Testimonial
============================================================ */

// ============================================================
// 1. LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
        // Init AOS after loader (dengan try-catch agar aman jika CDN gagal)
        try {
            AOS.init({
                duration: 900,
                once: true,
                easing: 'ease-out-cubic',
                offset: 80
            });
        } catch(e) {
            console.warn('AOS failed to init:', e);
        }
        // Animate tech bars after load
        animateTechBars();
    }, 2000);
});


// ============================================================
// 2. NAVBAR — scroll shrink + active link highlight
// ============================================================
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    // Shrink navbar on scroll
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Back-to-top button
    const myBtn = document.getElementById('myBtn');
    if (myBtn) {
        if (window.scrollY > 400) {
            myBtn.classList.add('show');
        } else {
            myBtn.classList.remove('show');
        }
    }

    // Active nav link highlight
    highlightActiveSection();
});

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}


// ============================================================
// 3. BACK TO TOP
// ============================================================
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ============================================================
// 4. HAMBURGER MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');

if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileOverlay.classList.toggle('open');
        document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
    });
}

function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Close on overlay click
if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMobileMenu();
    });
}


// ============================================================
// 5. TYPED TEXT EFFECT (pure JS, no external lib needed)
// ============================================================
const typedEl = document.getElementById('typed-text');
const typedStrings = [
    'Embedded Engineer',
    'Mobile Developer',
    'Software Engineer',
    'Cybersecurity Researcher',
    'Problem Solver',
    'AI & ML Enthusiast',
    'Computer Vision Dev',
    'Full-Stack Developer'
];

let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    if (!typedEl) return;

    const currentString = typedStrings[typedIndex];

    if (isDeleting) {
        typedEl.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedEl.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentString.length) {
        isDeleting = true;
        typingSpeed = 1800; // pause at end
    }

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        typedIndex = (typedIndex + 1) % typedStrings.length;
        typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typed effect after loader
setTimeout(typeEffect, 2200);


// ============================================================
// 6. PARTICLE BACKGROUND CANVAS
// ============================================================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', () => {
        resize();
        particles = createParticles();
    });

    function createParticles() {
        const count = Math.floor((canvas.width * canvas.height) / 18000);
        return Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.8 + 0.4,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.1
        }));
    }

    particles = createParticles();

    // Mouse position for interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Move
            p.x += p.dx;
            p.y += p.dy;

            // Boundary wrap
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(252, 218, 105, ${p.opacity})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 120;

                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(252, 218, 105, ${0.12 * (1 - dist / maxDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.x += dx / dist * 1.5;
                    p.y += dy / dist * 1.5;
                }
            }
        });

        animFrame = requestAnimationFrame(drawParticles);
    }

    drawParticles();
})();


// ============================================================
// 7. TECH BARS ANIMATION
// ============================================================
function animateTechBars() {
    const fills = document.querySelectorAll('.tech-fill');
    fills.forEach(fill => {
        const target = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = target;
        }, 200);
    });
}

// Re-animate when tech section enters view
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateTechBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}


// ============================================================
// 8. TESTIMONIAL SLIDER
// ============================================================
let currentSlide = 0;

function setupTestiSlider() {
    const cards = document.querySelectorAll('.testi-card');
    const dotsWrap = document.getElementById('testiDots');
    if (!cards.length || !dotsWrap) return;

    // Create dots
    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsWrap.appendChild(dot);
    });

    showSlide(0);
}

function showSlide(index) {
    const cards = document.querySelectorAll('.testi-card');
    const dots = document.querySelectorAll('.dot');
    if (!cards.length) return;

    currentSlide = (index + cards.length) % cards.length;

    cards.forEach((card, i) => {
        card.style.display = i === currentSlide ? 'block' : 'none';
        card.style.animation = i === currentSlide ? 'fadeIn 0.4s ease' : '';
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function slideTesti(dir) {
    showSlide(currentSlide + dir);
}

function goToSlide(index) {
    showSlide(index);
}

setupTestiSlider();

// Auto-slide every 6 seconds
let testiAutoplay = setInterval(() => slideTesti(1), 6000);

document.querySelectorAll('.testi-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(testiAutoplay);
        testiAutoplay = setInterval(() => slideTesti(1), 6000);
    });
});


// ============================================================
// 9. CONTACT FORM HANDLER — Formspree
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// 🔑 GANTI "FORMSPREE_ID" dengan kode dari dashboard formspree.io
// Contoh: jika link kamu https://formspree.io/f/xyzabcde → isi "xyzabcde"
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgkdprd';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.form-submit');
        const originalHTML = btn.innerHTML;

        // Loading state
        btn.innerHTML = `<span>Sending...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>`;
        btn.disabled = true;

        const formData = {
            name:    document.getElementById('formName').value,
            email:   document.getElementById('formEmail').value,
            subject: document.getElementById('formSubject').value || 'Portfolio Inquiry',
            message: document.getElementById('formMessage').value,
        };

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(formData),
            });

            if (res.ok) {
                // ✅ Sukses — reset form & tampil notifikasi
                contactForm.reset();
                btn.innerHTML = originalHTML;
                btn.disabled = false;
                if (formSuccess) {
                    formSuccess.innerHTML = '✅ Pesan terkirim! Saya akan segera membalas.';
                    formSuccess.classList.add('show');
                    setTimeout(() => formSuccess.classList.remove('show'), 5000);
                }
            } else {
                throw new Error('Server error');
            }
        } catch (err) {
            // ❌ Gagal — tampil error
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            if (formSuccess) {
                formSuccess.innerHTML = '❌ Gagal mengirim. Coba lagi atau hubungi via WhatsApp.';
                formSuccess.style.background = 'rgba(239,68,68,0.15)';
                formSuccess.style.borderColor = 'rgba(239,68,68,0.3)';
                formSuccess.style.color = '#f87171';
                formSuccess.classList.add('show');
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                    formSuccess.style = '';
                }, 5000);
            }
        }
    });
}


// ============================================================
// 10. SMOOTH SCROLL OFFSET (accounts for fixed navbar)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = nav ? nav.offsetHeight : 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});


// ============================================================
// 11. SERVICE CARD HOVER RIPPLE (micro-interaction)
// ============================================================
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});