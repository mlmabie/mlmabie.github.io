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
        // Update toggle button text
        var btn = document.querySelector('.theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀' : '☽';
    }

    function initTheme() {
        var stored = getStoredTheme();
        if (stored) {
            setTheme(stored);
        } else {
            // Set button to match system preference
            var btn = document.querySelector('.theme-toggle');
            if (btn) {
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                btn.textContent = prefersDark ? '☀' : '☽';
            }
        }
    }

    window.toggleTheme = function() {
        var current = document.documentElement.getAttribute('data-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (current === 'dark' || (!current && prefersDark)) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    // ============================================
    // FOOTNOTE HOVER TOOLTIPS (Dario-style)
    // ============================================

    function initFootnoteTooltips() {
        document.querySelectorAll('.footnote-ref, a[href^="#fn"]').forEach(function(ref) {
            var targetId = ref.getAttribute('href');
            if (!targetId || targetId.charAt(0) !== '#') return;
            var target = document.getElementById(targetId.slice(1));
            if (!target) return;

            var tooltip = document.createElement('div');
            tooltip.className = 'fn-tooltip';
            tooltip.innerHTML = target.innerHTML;
            // Remove backref from tooltip
            var backref = tooltip.querySelector('a[href^="#fnref"]');
            if (backref) backref.remove();
            document.body.appendChild(tooltip);

            ref.addEventListener('mouseenter', function(e) {
                var rect = ref.getBoundingClientRect();
                tooltip.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
                tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
                tooltip.classList.add('visible');
            });
            ref.addEventListener('mouseleave', function() {
                tooltip.classList.remove('visible');
            });
        });
    }

    // ============================================
    // SIDENOTE INTERACTIONS (mobile)
    // ============================================

    function initSidenotes() {
        document.querySelectorAll('.sidenote-number').forEach(function(el) {
            el.addEventListener('click', function() {
                if (window.innerWidth <= 1100) {
                    var toggle = this.previousElementSibling;
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
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ============================================
    // TABLE OF CONTENTS GENERATION
    // ============================================

    function generateTOC() {
        var tocContainer = document.querySelector('.toc ul');
        var content = document.querySelector('.essay-content');
        if (!tocContainer || !content) return;

        var headings = content.querySelectorAll('h2');
        if (headings.length === 0) {
            var toc = document.querySelector('.toc');
            if (toc) toc.style.display = 'none';
            return;
        }

        headings.forEach(function(heading, index) {
            if (!heading.id) heading.id = 'section-' + (index + 1);
            var li = document.createElement('li');
            var a = document.createElement('a');
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
        var progressBar = document.querySelector('.reading-progress');
        if (!progressBar) return;
        var essay = document.querySelector('.essay-content');
        if (!essay) return;

        function updateProgress() {
            var essayRect = essay.getBoundingClientRect();
            var scrolled = Math.max(0, -essayRect.top);
            var scrollable = essay.offsetHeight - window.innerHeight;
            progressBar.style.width = Math.min(100, (scrolled / scrollable) * 100) + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // ============================================
    // EXTERNAL LINK HANDLING
    // ============================================

    function initExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
            if (link.hostname === window.location.hostname) return;
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
        initFootnoteTooltips();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
