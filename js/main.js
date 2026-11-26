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
    // TALMUDIC MARGIN MODES, SPOTLIGHT & TRANSLATOR NOTES
    // ============================================

    function initTalmudLayout() {
        var essayMain = document.querySelector('main.talmud-essay');
        if (!essayMain) return;

        // Mode buttons (All Voices / Rashi / Tosafot / Linear / Center Only)
        var buttons = essayMain.querySelectorAll('.talmud-mode-btn');
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var mode = this.getAttribute('data-mode') || 'all';
                essayMain.setAttribute('data-talmud-mode', mode);
                buttons.forEach(function(b) {
                    var active = b === btn;
                    b.classList.toggle('active', active);
                    b.setAttribute('aria-pressed', active ? 'true' : 'false');
                });
            });
        });

        // Cross-reference phrase <-> margin spotlight
        function setHighlight(dafId, on) {
            if (!dafId) return;
            var note = document.getElementById(dafId);
            if (note) note.classList.toggle('is-highlighted', on);
            essayMain.querySelectorAll('.daf-anchor[data-daf="' + dafId + '"]').forEach(function(a) {
                a.classList.toggle('is-highlighted', on);
            });
        }

        essayMain.querySelectorAll('.daf-anchor').forEach(function(anchor) {
            var dafId = anchor.getAttribute('data-daf');
            anchor.addEventListener('mouseenter', function() { setHighlight(dafId, true); });
            anchor.addEventListener('mouseleave', function() { setHighlight(dafId, false); });
            anchor.addEventListener('click', function() {
                var note = dafId && document.getElementById(dafId);
                if (note && window.innerWidth < 1040) {
                    note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        essayMain.querySelectorAll('.margin-note[id]').forEach(function(note) {
            var dafId = note.id;
            note.addEventListener('mouseenter', function() { setHighlight(dafId, true); });
            note.addEventListener('mouseleave', function() { setHighlight(dafId, false); });
        });

        // Mobile tap support + viewport edge clamping for Bible-translator hover-notes
        essayMain.querySelectorAll('.tx-note').forEach(function(tx) {
            function clampPopover() {
                if (window.innerWidth <= 640) return;
                var pop = tx.querySelector('.tx-popover');
                if (!pop) return;
                pop.style.left = '';
                pop.style.right = '';
                pop.style.transform = '';
                var rect = pop.getBoundingClientRect();
                if (rect.width === 0) return;
                if (rect.left < 12) {
                    pop.style.left = '0';
                    pop.style.transform = 'none';
                } else if (rect.right > window.innerWidth - 12) {
                    pop.style.left = 'auto';
                    pop.style.right = '0';
                    pop.style.transform = 'none';
                }
            }
            tx.addEventListener('mouseenter', clampPopover);
            tx.addEventListener('focus', clampPopover);
            tx.addEventListener('click', function(e) {
                e.stopPropagation();
                var wasOpen = tx.classList.contains('tx-open');
                essayMain.querySelectorAll('.tx-note.tx-open').forEach(function(other) {
                    other.classList.remove('tx-open');
                });
                if (!wasOpen) {
                    tx.classList.add('tx-open');
                    clampPopover();
                }
            });
        });

        document.addEventListener('click', function() {
            essayMain.querySelectorAll('.tx-note.tx-open').forEach(function(tx) {
                tx.classList.remove('tx-open');
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key !== 'Escape') return;
            essayMain.querySelectorAll('.tx-note.tx-open').forEach(function(tx) {
                tx.classList.remove('tx-open');
            });
            if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.tx-note')) {
                document.activeElement.blur();
            }
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
        initTalmudLayout();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
