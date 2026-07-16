# docs-root-redirect-home

**Date:** 2026-07-14T200205Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by a line containing only `---`._

```
could you make sure the root redirects to the home page?
```

---

## Purpose

Make GitHub Pages / MkDocs site root redirect to handbook home

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added docs/index.md that runs location.replace('./dev/') so / redirects to the handbook home at /dev/, with a manual link fallback. Verified via mkdocs build that site/index.html contains the script.

---

## Code Changes

- `docs/index.md`
