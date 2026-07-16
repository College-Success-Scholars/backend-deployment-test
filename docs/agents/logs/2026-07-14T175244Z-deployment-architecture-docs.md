# deployment-architecture-docs

**Date:** 2026-07-14T175244Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
As senior developer with 20+ years of expereice, cross reference the current alerts with what needs to be done with the codebase, specfically more could be done to improve dev-ops.

---

research the capabilities of supabases free teir as of july 14 2026, and ensure we can follow through with this pipe line, since im fairly certain we can have multiple database branches (regrettably)

---

where in our documentation does it show our deployment arcitecture?

---

write it out in the docs tree where it makes the most sense given the current arcitecture
```

---

## Purpose

Document deployment topology in docs/dev where it belongs as a handbook hub

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Added docs/dev/deployment/README.md covering runtime topology, Railway split vs Vercel experimentalServices, Docker Compose CI/parity, CI/docs workflows, env wiring, and smoke validation. Linked from docs/dev README nav/stack, mkdocs.yml, codebase-notes, backend/frontend railway.toml notes, and scripts Purpose.

---

## Code Changes

- `docs/dev/deployment/README.md`
- `docs/dev/README.md`
- `mkdocs.yml`
- `docs/agents/codebase-notes.md`
- `docs/dev/backend/README.md`
- `docs/dev/frontend/README.md`
- `docs/dev/scripts/README.md`
