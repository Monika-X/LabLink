document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Load preference from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    const updateThemeIcon = () => {
        if (themeToggleBtn) {
            const isDark = root.getAttribute('data-theme') === 'dark';
            themeToggleBtn.textContent = isDark ? '🌙' : '☀️';
            themeToggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        }
    };

    updateThemeIcon();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon();
        });
    }

    // LTR/RTL Toggling
    const dirToggleBtn = document.getElementById('dir-toggle');
    
    const savedDir = localStorage.getItem('dir');
    if (savedDir) {
        root.setAttribute('dir', savedDir);
    }

    const updateDirIcon = () => {
        if (dirToggleBtn) {
            const isRtl = root.getAttribute('dir') === 'rtl';
            dirToggleBtn.textContent = isRtl ? 'LTR' : 'RTL';
            dirToggleBtn.title = isRtl ? 'Switch to LTR' : 'Switch to RTL';
        }
    };

    updateDirIcon();

    if (dirToggleBtn) {
        dirToggleBtn.addEventListener('click', () => {
            const currentDir = root.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            root.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateDirIcon();
        });
    }

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Sticky Navbar
    const navbar = document.querySelector('.header');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        });
    }

    // Back to top
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
