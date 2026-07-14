# nixpacks-vs-docker

**Date:** 2026-07-14T184847Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
what the main difference between nixpacks and docker?

---

log it
```

---

## Purpose

Explain Nixpacks vs Docker in the context of this repo's Railway deploys

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Explained that Nixpacks auto-builds from detected language/stack while Docker uses an explicit Dockerfile; noted this monorepo uses root Dockerfiles because shared/ sits outside backend/frontend package roots, so Railway Nixpacks alone is insufficient.

---

## Code Changes

- `none`
