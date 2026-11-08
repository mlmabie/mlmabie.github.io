# mlmabie.github.io

Personal site: work, research, essays, marginalia, music, and public graph views. Static HTML hosted on GitHub Pages.

## Structure

```
├── index.html              # Homepage
├── work.html / research.html
├── blog.html               # New public writing index
├── mabie-industries.html   # Consulting (nav label: Consulting)
├── applied-epistemics.html
├── agent-environments.html
├── archive.html            # Secondary material
├── about.html / now.html   # Bio and current focus
├── mechanical.html / music.html
├── resume.html             # CV page (nav label: CV); links assets/resumes/malachi_mabie_cv.pdf
├── marginalia.html         # Aphorisms & fragments
├── essays/                 # Long-form writing and blog posts
├── graph/                  # Interactive knowledge graph (3 topology views)
│   └── preload.json        # Deployed from notes-network pipeline
├── garden/                 # Three.js garden visualization
├── css/style.css           # Shared styles for inner pages
├── css/home.css            # Front page only (deliberately plain)
├── js/main.js
└── scripts/check_site.py   # Link, anchor, and nav-consistency check
```

## Knowledge Graph Pipeline

The graph and garden visualizations are powered by `preload.json`, built from Obsidian vault notes via [`notes-network`](../DRAFTS_STUDY/notes-network/).

Notes tagged `public` in their YAML frontmatter are included. The pipeline embeds all vault notes (cached), then filters, computes layouts, and labels edges via Claude.

```bash
cd ~/DRAFTS_STUDY/notes-network

# Build public graph and deploy to site
uv run python refresh.py --public --deploy
```

To add a note to the public graph, add `public` to its frontmatter tags in Obsidian and rerun.

## Layers

Stable: the front page, About, Work, Research, Essays, Consulting, CV. These share one nav, which `scripts/check_site.py` keeps identical across pages.

Experimental: `graph/`, `garden/`, `writing/`, and the archive. They keep their own layouts and are linked from the front page's "Elsewhere" section rather than the main nav.

## Updating the CV

The public CV is the comprehensive CV from the private resume-portfolio repo with the phone line redacted. When the CV changes, run `make publish-public-cv` in resume-portfolio: it builds the redacted CV, refuses to publish while any page here still states a claim the CV has retired, and copies the PDF to `assets/resumes/malachi_mabie_cv.pdf`.

## Local Development

Open any HTML file directly — no build step. For live reload:

```bash
python3 -m http.server 8000
```

Before pushing:

```bash
python3 scripts/check_site.py
```
