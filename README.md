# mlmabie.github.io

Personal site: work, research, essays, marginalia, music, and public graph views. Static HTML hosted on GitHub Pages.

## Structure

```
├── index.html              # Homepage
├── work.html / research.html
├── blog.html               # Redirect to /writing/
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

Experimental: `graph/`, `garden/`, `syntheses/`, and the archive. They keep their own layouts and are linked from the front page's "Elsewhere" section rather than the main nav.

## Updating the CV

The private `resume-portfolio` repository is the source for the comprehensive CV. With both repositories checked out side by side, run `make publish-public-cv` in `resume-portfolio` to build and sync the PDF with phone and email removed to `assets/resumes/malachi_mabie_cv.pdf`. Review the website diff before publishing. The public CV page links to that PDF.

## Cloudflare Pages Preview

Connect only `mlmabie/mlmabie.github.io` in [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/git-integration/). For the isolated preview, select `cloudflare-preview` as the production branch of the Pages project. Leave the framework preset and root directory at their defaults, set the build command to `python3 scripts/build_pages.py`, and set the output directory to `dist`. Use the `pages.dev` URL for initial verification. Once this build is on `main`, point the Pages project at `main` to follow normal website updates.

The build copies tracked public assets and checks links, anchors, and navigation in the output. GitHub Actions runs the same build on pull requests and pushes to `main`. The site-wide headers allow same-origin framing for the essay PDFs. The base `pages.dev` host carries `X-Robots-Tag: noindex`, and Cloudflare adds the same directive to branch previews. Check the home page, an embedded PDF, the graph, the garden, and a 404 on the preview before attaching a custom hostname. [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)

The live domain currently uses Namecheap nameservers and Namecheap email forwarding. The `pages.dev` preview requires no DNS changes. A custom preview subdomain can be added through Pages and then pointed at the project with a Namecheap CNAME. Moving the apex to Pages requires a nameserver change. Record all active forwarding addresses and plan their replacement before that change because Namecheap forwarding depends on Namecheap DNS. [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Namecheap forwarding](https://www.namecheap.com/support/knowledgebase/article.aspx/308/2214/how-to-set-up-free-email-forwarding/)

## Local Development

Open any HTML file directly — no build step. For live reload:

```bash
python3 -m http.server 8000
```

Before pushing:

```bash
python3 scripts/check_site.py
```
