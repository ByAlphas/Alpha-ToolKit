# Security Policy

## Overview

Alpha Toolkit is a **fully client-side** application. Every operation — hashing, encoding, password generation, file analysis — runs in the user's browser using native Web APIs (`crypto.subtle`, `FileReader`, `Canvas`). No data is transmitted to any server, and there is no backend, database, or user authentication system.

This significantly reduces the attack surface compared to a typical web application. However, vulnerabilities in the client-side code (XSS, logic bugs, insecure randomness) are still taken seriously.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.x (current) | Yes |
| 1.x | No — please upgrade |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, open a [GitHub Security Advisory](https://github.com/byalphas/alpha-toolkit/security/advisories/new) (private disclosure).

Include:
- A clear description of the vulnerability
- Steps to reproduce or a proof-of-concept
- The potential impact
- Your suggested fix, if you have one

You can expect an acknowledgement within **72 hours** and a status update within **7 days**.

---

## Scope

Issues we want to hear about:

- **Cross-site scripting (XSS)** — especially in tools that render user-supplied content (Markdown preview, HTML codec, JSON formatter)
- **Insecure randomness** — any code path that should use `crypto.getRandomValues()` but doesn't
- **Logic errors in crypto tools** — incorrect HMAC key handling, wrong hash output, broken bcrypt verification
- **Service Worker cache poisoning** — anything that could cause a malicious response to be served from cache
- **Sensitive data leakage** — user input persisting beyond the session in unexpected ways (localStorage, history, referrer headers)

Out of scope:

- Vulnerabilities in third-party vendor libraries (`qrcode.min.js`, `jsQR.min.js`, `qrious.min.js`) — please report those to the upstream maintainers
- Self-XSS (requires the user to paste malicious code into the browser console)
- Attacks that require physical access to the user's device
- Denial of service via large file inputs (these are handled gracefully by design)

---

## Security Design Decisions

| Decision | Reason |
|----------|--------|
| All crypto via `crypto.subtle` | Browser-native, audited, hardware-accelerated |
| No `eval()` or `new Function()` anywhere | Eliminates a major XSS vector |
| `textContent` over `innerHTML` where possible | Prevents unintended HTML injection |
| `rel="noopener noreferrer"` on all external links | Prevents tab-napping |
| Service Worker scope limited to same origin | No cross-origin cache manipulation |
| No localStorage / sessionStorage for sensitive data | Hashed or encoded data is never persisted |

---

## Acknowledgements

Responsible disclosures will be credited in the release notes of the fix, with the reporter's permission.
