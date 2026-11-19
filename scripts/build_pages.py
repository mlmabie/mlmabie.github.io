#!/usr/bin/env python3
"""Build and validate the public static files for Cloudflare Pages."""

import os
from pathlib import Path
import shutil
import subprocess
import sys
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIRECTORIES = {
    "assets", "css", "essays", "garden", "graph", "js", "syntheses", "writing",
}
PUBLIC_EXTENSIONS = {".css", ".html", ".jpg", ".js", ".json", ".pdf", ".png", ".pptx", ".svg"}
MAX_ASSET_SIZE = 25 * 1024 * 1024


def main():
    tracked = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT)
    output = ROOT / "dist"
    with TemporaryDirectory(dir=ROOT, prefix=".pages-build-") as temporary:
        staged = Path(temporary) / "site"
        staged.mkdir()
        count = 0
        for entry in tracked.split(b"\0"):
            if not entry:
                continue
            path = Path(os.fsdecode(entry))
            if any(part.startswith(".") for part in path.parts):
                continue
            if len(path.parts) == 1:
                if path.suffix != ".html" and path.name != "favicon.svg":
                    continue
            elif path.parts[0] not in PUBLIC_DIRECTORIES or path.suffix not in PUBLIC_EXTENSIONS:
                continue

            source = ROOT / path
            if source.resolve() != source or not source.is_file():
                raise SystemExit(f"Expected a regular public asset: {path}")
            if source.stat().st_size > MAX_ASSET_SIZE:
                raise SystemExit(f"Asset exceeds the Cloudflare Pages size limit: {path}")
            target = staged / path
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
            count += 1

        for required in ("index.html", "404.html"):
            if not (staged / required).is_file():
                raise SystemExit(f"Missing required Pages file: {required}")

        shutil.copyfile(ROOT / "cloudflare" / "_headers", staged / "_headers")
        subprocess.run(
            [sys.executable, str(ROOT / "scripts" / "check_site.py"), "--root", str(staged)],
            check=True,
        )
        if output.exists():
            shutil.rmtree(output)
        staged.rename(output)
    print(f"Built {count} public files plus _headers in {output}")


if __name__ == "__main__":
    main()
