document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggling
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    // Load preference from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    }

    const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    const updateThemeIcon = () => {
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = isDark ? moonIcon : sunIcon;
            themeToggleBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        }
        const mobileThemeBtn = document.getElementById('mobile-theme');
        if (mobileThemeBtn) {
            mobileThemeBtn.innerHTML = isDark ? moonIcon : sunIcon;
            mobileThemeBtn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        }
    };

    updateThemeIcon();

    const toggleTheme = () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    const mobileThemeBtn = document.getElementById('mobile-theme');
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', toggleTheme);
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
        const mobileDirBtn = document.getElementById('mobile-dir');
        if (mobileDirBtn) {
            const isRtl = root.getAttribute('dir') === 'rtl';
            mobileDirBtn.textContent = isRtl ? 'LTR' : 'RTL';
            mobileDirBtn.title = isRtl ? 'Switch to LTR' : 'Switch to RTL';
        }
    };

    updateDirIcon();

    const toggleDir = () => {
        const currentDir = root.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        root.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
        updateDirIcon();
    };

    if (dirToggleBtn) {
        dirToggleBtn.addEventListener('click', toggleDir);
    }

    const mobileDirBtn = document.getElementById('mobile-dir');
    if (mobileDirBtn) {
        mobileDirBtn.addEventListener('click', toggleDir);
    }

    // Profile Dropdown
    const profileDropdown = document.querySelector('.profile-dropdown');
    if (profileDropdown) {
        const profileBtn = profileDropdown.querySelector('.profile-btn');
        const profileMenu = profileDropdown.querySelector('.profile-menu');

        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            profileMenu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target)) {
                profileMenu.classList.remove('open');
            }
        });

        window.addEventListener('pageshow', () => {
            profileMenu.classList.remove('open');
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

    // Mobile Menu (hamburger)
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');

    const openMenu = () => {
        if (menuToggle) {
            menuToggle.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
        }
        if (menuBackdrop) menuBackdrop.classList.add('show');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        if (menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            if (mobileMenu && mobileMenu.contains(document.activeElement)) {
                menuToggle.focus();
            }
        }
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
        if (menuBackdrop) menuBackdrop.classList.remove('show');
        document.body.classList.remove('no-scroll');
    };

    if (menuToggle && mobileMenu) {
        // Inject close button dynamically
        const mobileMenuHead = mobileMenu.querySelector('.mobile-menu-head');
        if (mobileMenuHead && !mobileMenuHead.querySelector('.mobile-close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'mobile-close-btn';
            closeBtn.setAttribute('aria-label', 'Close menu');
            closeBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            closeBtn.addEventListener('click', closeMenu);
            mobileMenuHead.appendChild(closeBtn);
        }

        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
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

    // Form Handling (AJAX-style: no page reload, success toast, reset only the submitted form)
    const toastCheckIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--medical-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

    let formToast = null;
    const getFormToast = () => {
        if (!formToast) {
            formToast = document.createElement('div');
            formToast.className = 'form-toast';
            document.body.appendChild(formToast);
        }
        return formToast;
    };

    const showFormToast = (message) => {
        const toast = getFormToast();
        toast.innerHTML = toastCheckIcon + '<span>' + message + '</span>';
        toast.classList.add('show');
        clearTimeout(showFormToast._timer);
        showFormToast._timer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    };

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const submitBtn = form.querySelector('button[type="submit"]');
            const message = form.getAttribute('data-success') || 'Submitted successfully!';
            const redirect = form.getAttribute('data-redirect');
            if (submitBtn) submitBtn.disabled = true;
            setTimeout(() => {
                form.reset();
                showFormToast(message);
                if (submitBtn) submitBtn.disabled = false;
                if (redirect) setTimeout(() => { window.location.href = redirect; }, 1200);
            }, 500);
        });
    });

    // Download Links
    document.querySelectorAll('a.download-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showFormToast('Report downloaded successfully!');
        });
    });
});
