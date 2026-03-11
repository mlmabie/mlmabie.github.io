# mlmabie.github.io

Personal site — essays, knowledge graph, and garden visualization. Static HTML hosted on GitHub Pages.

## Structure

```
├── index.html              # Homepage
├── about.html / now.html   # Bio and current focus
├── marginalia.html         # Aphorisms & fragments
├── essays/                 # Long-form writing
├── graph/                  # Interactive knowledge graph (3 topology views)
│   └── preload.json        # Deployed from notes-network pipeline
├── garden/                 # Three.js garden visualization
├── css/style.css
└── js/main.js
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

## Local Development

Open any HTML file directly — no build step. For live reload:

```bash
python3 -m http.server 8000
```
