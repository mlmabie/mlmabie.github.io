/* ============================================
   ESSAY SITE JS
   Minimal, progressive enhancement only
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // THEME TOGGLE
    // ============================================
    
    const THEME_KEY = 'site-theme';
    
    function getStoredTheme() {
        return localStorage.getItem(THEME_KEY);
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }
    
    function initTheme() {
        const stored = getStoredTheme();
        if (stored) {
            setTheme(stored);
        }
        // Otherwise, let CSS media query handle it
    }
    
    // Toggle function for optional theme switcher button
    window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (current === 'dark' || (!current && prefersDark)) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };
    
    // ============================================
    // SIDENOTE INTERACTIONS (mobile)
    // ============================================
    
    function initSidenotes() {
        const sidenoteNumbers = document.querySelectorAll('.sidenote-number');
        
        sidenoteNumbers.forEach(function(el) {
            el.addEventListener('click', function(e) {
                // On mobile, toggle visibility
                if (window.innerWidth <= 1100) {
                    const toggle = this.previousElementSibling;
                    if (toggle && toggle.classList.contains('sidenote-toggle')) {
                        toggle.checked = !toggle.checked;
                    }
                }
            });
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // ============================================
    // TABLE OF CONTENTS GENERATION
    // ============================================
    
    function generateTOC() {
        const tocContainer = document.querySelector('.toc ul');
        const content = document.querySelector('.essay-content');
        
        if (!tocContainer || !content) return;
        
        const headings = content.querySelectorAll('h2');
        
        if (headings.length === 0) {
            // Hide TOC if no headings
            const toc = document.querySelector('.toc');
            if (toc) toc.style.display = 'none';
            return;
        }
        
        headings.forEach(function(heading, index) {
            // Ensure heading has an ID
            if (!heading.id) {
                heading.id = 'section-' + (index + 1);
            }
            
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocContainer.appendChild(li);
        });
    }
    
    // ============================================
    // READING PROGRESS (optional)
    // ============================================
    
    function initReadingProgress() {
        const progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;
        
        const essay = document.querySelector('.essay-content');
        if (!essay) return;
        
        function updateProgress() {
            const essayRect = essay.getBoundingClientRect();
            const essayHeight = essay.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the essay has been scrolled past
            const scrolled = Math.max(0, -essayRect.top);
            const scrollable = essayHeight - windowHeight;
            const progress = Math.min(100, (scrolled / scrollable) * 100);
            
            progressBar.style.width = progress + '%';
        }
        
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }
    
    // ============================================
    // EXTERNAL LINK HANDLING
    // ============================================
    
    function initExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
            // Skip internal links
            if (link.hostname === window.location.hostname) return;
            
            // Open external links in new tab
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }
    
    // ============================================
    // INITIALIZE
    // ============================================
    
    function init() {
        initTheme();
        initSidenotes();
        initSmoothScroll();
        generateTOC();
        initReadingProgress();
        initExternalLinks();
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
