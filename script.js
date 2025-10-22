// ===== PORTFOLIO WEBSITE JAVASCRIPT =====
// Author: Kahaf Sameer
// Description: Interactive functionality for DevOps portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE NAVIGATION =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== NAVBAR BACKGROUND ON SCROLL =====
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // ===== SKILL BARS ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                bar.style.width = width;
                bar.classList.add('animated');
            }
        });
    };

    // Animate skill bars on scroll
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Run once on load

    // ===== TYPING ANIMATION FOR TERMINAL =====
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        const commands = [
            'git status',
            'docker ps',
            'kubectl get pods',
            'terraform plan',
            'ansible-playbook deploy.yml'
        ];
        
        let commandIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeCommand = () => {
            const currentCommand = commands[commandIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentCommand.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentCommand.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentCommand.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                typeSpeed = 500; // Pause before next command
            }
            
            setTimeout(typeCommand, typeSpeed);
        };
        
        // Start typing animation after a delay
        setTimeout(typeCommand, 2000);
    }

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .cert-card, .about-text, .about-visual');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // ===== FORM HANDLING =====
    const contactForm = document.querySelector('.form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // ===== EMAIL VALIDATION =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff6b35' : '#0088ff'};
            color: #0a0a0a;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Fira Code', monospace;
            font-weight: 600;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });

    // ===== ACTIVE NAVIGATION LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavigation = () => {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', highlightNavigation);

    // ===== PARTICLE EFFECT FOR HERO BACKGROUND =====
    function createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #00ff88;
                border-radius: 50%;
                opacity: 0.3;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            hero.appendChild(particle);
        }
    }
    
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 0.3;
            }
            90% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: #00ff88 !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
    
    // Create particles
    createParticles();

    // ===== CONSOLE WELCOME MESSAGE =====
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║  🚀 Welcome to Kahaf Sameer's DevOps Portfolio! 🚀          ║
    ║                                                              ║
    ║  👨‍💻 DevOps Engineer | Workflow Optimizer                    ║
    ║  🐳 Docker • 🔄 CI/CD • 🐧 Linux • 📝 YAML                  ║
    ║                                                              ║
    ║  💡 Interested in automation and infrastructure?            ║
    ║  📧 Let's connect: kahaf.sameer@email.com                   ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    `);

    // ===== PERFORMANCE OPTIMIZATION =====
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Arrow keys for navigation (accessibility)
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy(0, window.innerHeight);
        }
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy(0, -window.innerHeight);
        }
    });

    // ===== INITIALIZATION COMPLETE =====
    console.log('🎉 Portfolio website initialized successfully!');
    console.log('📊 All animations and interactions are ready.');
});
