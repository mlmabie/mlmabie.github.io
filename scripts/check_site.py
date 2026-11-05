#!/usr/bin/env python3
"""Check the site before pushing: broken internal links, missing anchors, and nav drift.

Usage: python3 scripts/check_site.py   (exits 1 on any problem)

The site has no build step, so every page carries its own copy of the nav.
This script is what keeps those copies identical.
"""
import html.parser, pathlib, re, sys, urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
# Pages that intentionally have their own layout: the plain front page,
# the experiments, and fragments embedded by other pages.
OWN_LAYOUT = ("index.html", "graph/", "garden/", "writing/", "assets/")


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for key in ("href", "src"):
            if a.get(key):
                self.links.append(a[key])


def main():
    pages, navs, problems = {}, {}, []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel.startswith(".git"):
            continue
        text = path.read_text(encoding="utf-8")
        page = Page()
        page.feed(text)
        pages[rel] = page
        if not rel.startswith(OWN_LAYOUT):
            nav = re.search(r'<nav class="site-nav">.*?</nav>', text, re.S)
            navs[rel] = re.sub(r"\s+", " ", nav.group(0)) if nav else None

    for rel, page in pages.items():
        if rel.startswith("assets/"):
            continue
        for link in page.links:
            if link.startswith(("http:", "https:", "//", "mailto:", "tel:", "data:", "javascript:")):
                continue
            url = urllib.parse.urlparse(link)
            if not url.path:
                target = rel
            elif url.path.startswith("/"):
                target = url.path.lstrip("/")
            else:
                target = (pathlib.PurePosixPath(rel).parent / url.path).as_posix()
            target = target or "index.html"
            fs = ROOT / target
            if fs.is_dir() or target.endswith("/"):
                fs = fs / "index.html"
            if not fs.exists():
                problems.append(f"{rel}: broken link {link}")
                continue
            key = fs.relative_to(ROOT).as_posix()
            if url.fragment and key in pages and url.fragment not in pages[key].ids:
                problems.append(f"{rel}: missing anchor {link}")

    reference = navs.get("about.html")
    for rel, nav in navs.items():
        if nav is None:
            problems.append(f"{rel}: no site nav")
        elif nav != reference:
            problems.append(f"{rel}: nav differs from about.html")

    print("\n".join(problems) or f"ok: {len(pages)} pages")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
