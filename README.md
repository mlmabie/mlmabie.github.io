# mlmabie.github.io

Personal site — essays, resume variants, selected work, knowledge graph, and garden visualization. Static HTML hosted on GitHub Pages.

This non-iCloud checkout is the source of truth for the public website. Resume sources and private career strategy live in the separate private `~/Projects/resume-portfolio` repo; this site only carries deployable public artifacts.

## Structure

```
├── index.html              # Homepage
├── about.html / now.html   # Bio and current focus
├── marginalia.html         # Aphorisms & fragments
├── resume.html             # Public redacted resume variants
├── research.html / work.html
├── essays/                 # Long-form writing
├── assets/resumes/         # Published redacted PDFs
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

## Resume Workflow

Public PDFs in `assets/resumes/` are redacted for web use. Keep source edits in `~/Projects/resume-portfolio`, then publish the generated public PDF into this repo.

```bash
cd ~/Projects/resume-portfolio
make publish-public-systems
```

Avoid making iCloud Drive the working directory for resume edits.
