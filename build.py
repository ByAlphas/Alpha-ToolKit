"""
build.py — Alpha Toolkit build helper
=====================================
Usage:
  python build.py --meta      Add canonical + OG/Twitter meta tags to tools/*.html
  python build.py --nav       Inject nav HTML from _includes/_nav.html into tools/*.html
  python build.py --scripts   Migrate old script.js references to modular script tags
  python build.py --all       Run all three tasks
"""

import argparse
import os
import re
import sys

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT        = os.path.dirname(os.path.abspath(__file__))
TOOLS_DIR   = os.path.join(ROOT, 'tools')
NAV_FILE    = os.path.join(ROOT, '_includes', '_nav.html')
SITE_BASE   = 'https://byalphas.github.io/alpha-toolkit/'

# Old-style tools that need script-tag migration
SCRIPT_MIGRATION_FILES = [
    'password.html', 'hash.html', 'base64.html', 'uuid.html',
    'json-formatter.html', 'url-codec.html', 'jwt-decoder.html',
    'regex-tester.html', 'timestamp.html', 'case-converter.html',
    'markdown.html', 'qr-generator.html', 'qr-reader.html',
    'color-converter.html', 'gradient.html', 'lorem-ipsum.html',
    'text-diff.html',
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _tool_files():
    """Yield absolute paths for every *.html file inside tools/."""
    for name in sorted(os.listdir(TOOLS_DIR)):
        if name.endswith('.html'):
            yield os.path.join(TOOLS_DIR, name)


def _read(path):
    with open(path, 'r', encoding='utf-8') as fh:
        return fh.read()


def _write(path, content):
    with open(path, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(content)


# ---------------------------------------------------------------------------
# Task A — Canonical + OG meta tags
# ---------------------------------------------------------------------------

def _extract_title(html):
    """Return the text content of the first <title> element, or ''."""
    m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    return m.group(1).strip() if m else ''


def _extract_description(html):
    """Return the content= attribute value of <meta name="description">, or ''."""
    m = re.search(
        r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']',
        html, re.IGNORECASE | re.DOTALL
    )
    if m:
        return m.group(1).strip()
    # Also handle content= before name=
    m2 = re.search(
        r'<meta\s+content=["\'](.*?)["\']\s+name=["\']description["\']',
        html, re.IGNORECASE | re.DOTALL
    )
    return m2.group(1).strip() if m2 else ''


def _build_meta_block(filename, title, description):
    url = f'{SITE_BASE}tools/{filename}'
    lines = [
        f'  <link rel="canonical" href="{url}" />',
        f'  <meta property="og:title" content="{title}" />',
        f'  <meta property="og:description" content="{description}" />',
        f'  <meta property="og:url" content="{url}" />',
        f'  <meta property="og:type" content="website" />',
        f'  <meta property="og:site_name" content="Alpha Toolkit" />',
        f'  <meta name="twitter:card" content="summary" />',
        f'  <meta name="twitter:title" content="{title}" />',
        f'  <meta name="twitter:description" content="{description}" />',
    ]
    return '\n'.join(lines)


def run_meta():
    """Add canonical + OG/Twitter tags to all tools/*.html files."""
    print('\n[--meta] Adding canonical + OG/Twitter meta tags...')
    added = skipped = 0

    for path in _tool_files():
        filename = os.path.basename(path)
        html = _read(path)

        # Skip if already has og:title
        if 'og:title' in html:
            print(f'  SKIP  {filename}  (og:title already present)')
            skipped += 1
            continue

        title       = _extract_title(html)
        description = _extract_description(html)

        if not title and not description:
            print(f'  WARN  {filename}  (no title/description found, skipping)')
            skipped += 1
            continue

        meta_block = _build_meta_block(filename, title, description)

        # Find the <meta name="description" ...> line and insert after it
        # We match the full self-closing or non-self-closing tag line
        pattern = r'([ \t]*<meta\s+name=["\']description["\'][^>]*/?>)'
        replacement = r'\1' + '\n' + meta_block

        new_html, n = re.subn(pattern, replacement, html, count=1, flags=re.IGNORECASE)

        if n == 0:
            # Fallback: insert after </title>
            pattern2 = r'([ \t]*</title>)'
            replacement2 = r'\1' + '\n' + meta_block
            new_html, n2 = re.subn(pattern2, replacement2, html, count=1, flags=re.IGNORECASE)
            if n2 == 0:
                print(f'  WARN  {filename}  (could not find insertion point, skipping)')
                skipped += 1
                continue

        _write(path, new_html)
        print(f'  OK    {filename}')
        added += 1

    print(f'\n[--meta] Done. {added} updated, {skipped} skipped.')


# ---------------------------------------------------------------------------
# Task B — Nav injection
# ---------------------------------------------------------------------------

_NAV_START = '<!-- NAV:START -->'
_NAV_END   = '<!-- NAV:END -->'


def run_nav():
    """Inject _includes/_nav.html between NAV:START/NAV:END markers."""
    print('\n[--nav] Injecting nav HTML...')

    if not os.path.isfile(NAV_FILE):
        print(f'  ERROR  Nav template not found: {NAV_FILE}')
        sys.exit(1)

    nav_html = _read(NAV_FILE).rstrip('\n')
    injected = skipped_no_markers = 0

    for path in _tool_files():
        filename = os.path.basename(path)
        html = _read(path)

        if _NAV_START not in html or _NAV_END not in html:
            print(f'  SKIP  {filename}  (no NAV markers)')
            skipped_no_markers += 1
            continue

        # Replace everything between the markers (inclusive of markers)
        pattern = r'(<!-- NAV:START -->).*?(<!-- NAV:END -->)'
        replacement = f'{_NAV_START}\n{nav_html}\n{_NAV_END}'
        new_html, n = re.subn(pattern, replacement, html, count=1,
                               flags=re.DOTALL)

        if n == 0:
            print(f'  WARN  {filename}  (replacement failed, skipping)')
            skipped_no_markers += 1
            continue

        _write(path, new_html)
        print(f'  OK    {filename}')
        injected += 1

    print(f'\n[--nav] Done. {injected} updated, {skipped_no_markers} skipped.')


# ---------------------------------------------------------------------------
# Task C — Script tag migration
# ---------------------------------------------------------------------------

_OLD_SCRIPT = '  <script src="../script.js" defer></script>'


def _new_scripts(toolname):
    return (
        f'  <script src="../assets/js/core/utils.js" defer></script>\n'
        f'  <script src="../assets/js/core/nav.js" defer></script>\n'
        f'  <script src="../assets/js/tools/{toolname}.js" defer></script>'
    )


def run_scripts():
    """Migrate old ../script.js references to modular script tags."""
    print('\n[--scripts] Migrating script tags...')
    updated = skipped = 0

    for filename in SCRIPT_MIGRATION_FILES:
        path = os.path.join(TOOLS_DIR, filename)

        if not os.path.isfile(path):
            print(f'  MISS  {filename}  (file not found)')
            skipped += 1
            continue

        html = _read(path)

        # Skip if already migrated
        if '../assets/js/core/utils.js' in html:
            print(f'  SKIP  {filename}  (already has utils.js)')
            skipped += 1
            continue

        if _OLD_SCRIPT not in html:
            print(f'  WARN  {filename}  (old script tag not found)')
            skipped += 1
            continue

        toolname = os.path.splitext(filename)[0]   # e.g. "password"
        new_html = html.replace(_OLD_SCRIPT, _new_scripts(toolname), 1)

        _write(path, new_html)
        print(f'  OK    {filename}')
        updated += 1

    print(f'\n[--scripts] Done. {updated} updated, {skipped} skipped.')


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description='Alpha Toolkit build helper',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument('--meta',    action='store_true',
                        help='Add canonical + OG/Twitter meta tags to tools/*.html')
    parser.add_argument('--nav',     action='store_true',
                        help='Inject nav HTML from _includes/_nav.html into tools/*.html')
    parser.add_argument('--scripts', action='store_true',
                        help='Migrate old script.js tags to modular script tags')
    parser.add_argument('--all',     action='store_true',
                        help='Run all three tasks')

    args = parser.parse_args()

    if not any(vars(args).values()):
        parser.print_help()
        sys.exit(0)

    if args.all or args.meta:
        run_meta()

    if args.all or args.nav:
        run_nav()

    if args.all or args.scripts:
        run_scripts()

    print('\nBuild complete.')


if __name__ == '__main__':
    main()
