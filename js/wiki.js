/* ============================================
   WIKI JS
   Search, link processing, backlinks
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // WIKI LINK PROCESSING
    // Convert [[link]] syntax to actual links
    // ============================================
    
    function processWikiLinks() {
        const content = document.querySelector('.wiki-content');
        if (!content) return;
        
        // Find text nodes with [[...]] pattern
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const nodesToProcess = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('[[')) {
                nodesToProcess.push(node);
            }
        }
        
        nodesToProcess.forEach(function(textNode) {
            const text = textNode.textContent;
            const regex = /\[\[([^\]]+)\]\]/g;
            
            if (regex.test(text)) {
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                let match;
                
                regex.lastIndex = 0; // Reset regex
                while ((match = regex.exec(text)) !== null) {
                    // Add text before match
                    if (match.index > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex, match.index))
                        );
                    }
                    
                    // Create link
                    const linkText = match[1];
                    const slug = slugify(linkText);
                    const link = document.createElement('a');
                    link.href = slug + '.html';
                    link.className = 'wiki-link';
                    link.textContent = linkText;
                    fragment.appendChild(link);
                    
                    lastIndex = regex.lastIndex;
                }
                
                // Add remaining text
                if (lastIndex < text.length) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(lastIndex))
                    );
                }
                
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }
    
    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // ============================================
    // SEARCH
    // ============================================
    
    function initSearch() {
        const searchInput = document.getElementById('wiki-search');
        if (!searchInput) return;
        
        // Simple client-side search
        // In production, you'd want something like Pagefind or Lunr.js
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                clearSearchResults();
                return;
            }
            
            // For now, just filter visible note list
            const noteItems = document.querySelectorAll('.note-list-item');
            noteItems.forEach(function(item) {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
        
        // Keyboard shortcut: / to focus search
        document.addEventListener('keydown', function(e) {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.blur();
                clearSearchResults();
            }
        });
    }
    
    function clearSearchResults() {
        const noteItems = document.querySelectorAll('.note-list-item');
        noteItems.forEach(function(item) {
            item.style.display = '';
        });
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    
    function initMobileMenu() {
        const menuBtn = document.querySelector('.wiki-mobile-menu-btn');
        const sidebar = document.querySelector('.wiki-sidebar');
        
        if (!menuBtn || !sidebar) return;
        
        menuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            
            // Add styles for open state
            if (sidebar.classList.contains('open')) {
                sidebar.style.display = 'block';
                sidebar.style.position = 'fixed';
                sidebar.style.top = '0';
                sidebar.style.left = '0';
                sidebar.style.right = '0';
                sidebar.style.bottom = '0';
                sidebar.style.zIndex = '100';
                sidebar.style.width = '100%';
                sidebar.style.maxWidth = '280px';
            } else {
                sidebar.style.display = '';
                sidebar.style.position = '';
                sidebar.style.top = '';
                sidebar.style.left = '';
                sidebar.style.right = '';
                sidebar.style.bottom = '';
                sidebar.style.zIndex = '';
                sidebar.style.width = '';
                sidebar.style.maxWidth = '';
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebar.style.display = '';
            }
        });
    }

    // ============================================
    // EXTERNAL LINKS
    // ============================================
    
    function initExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(function(link) {
            if (link.hostname === window.location.hostname) return;
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ============================================
    // HEADING ANCHORS
    // ============================================
    
    function initHeadingAnchors() {
        const content = document.querySelector('.wiki-content');
        if (!content) return;
        
        content.querySelectorAll('h2[id], h3[id]').forEach(function(heading) {
            heading.style.cursor = 'pointer';
            heading.addEventListener('click', function() {
                const url = window.location.href.split('#')[0] + '#' + heading.id;
                navigator.clipboard.writeText(url).then(function() {
                    // Brief visual feedback
                    heading.style.opacity = '0.5';
                    setTimeout(function() {
                        heading.style.opacity = '';
                    }, 200);
                });
            });
        });
    }

    // ============================================
    // THEME
    // ============================================
    
    const THEME_KEY = 'site-theme';
    
    function initTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) {
            document.documentElement.setAttribute('data-theme', stored);
        }
    }
    
    window.toggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (current === 'dark' || (!current && prefersDark)) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem(THEME_KEY, 'dark');
        }
    };

    // ============================================
    // INITIALIZE
    // ============================================
    
    function init() {
        initTheme();
        processWikiLinks();
        initSearch();
        initMobileMenu();
        initExternalLinks();
        initHeadingAnchors();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
