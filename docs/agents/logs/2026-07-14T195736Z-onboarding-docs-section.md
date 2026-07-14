# onboarding-docs-section

**Date:** 2026-07-14T195736Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by a line containing only `---`._

```
What do we have in terms of tutorials for new developers in the codebase?

---

What would yopu reccomend as a senior developer with 20+ years of experience, and what would you want to see as a junior developer with almost no professional experience. For most effective roleplay, use two different agents with these prompts

---

What would the structure look like in the docs tree?

---

make sure the pr template is used in onboareding, and that it links to the template we have.
for the people to ask, include the people who have made writes as of right now, miguel, ben, moosay, and link their emails.

---

go ahead an write this out
```

---

## Purpose

Add docs/dev/onboarding guided path for new developers with PR template and writer contacts

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Created docs/dev/onboarding (index, Day 0 setup, golden-path first PR, roles/personas, campus weeks, auth/RLS runbook, ask/don't-touch) linking to docs/dev/pr/TEMPLATE.md and mailto contacts for Miguel, Ben, and Moosay. Wired MkDocs Onboarding nav (including PR template page), handbook home nav row, Local Development pointer, and codebase-notes operational note.

---

## Code Changes

- `docs/agents/codebase-notes.md`
- `docs/dev/README.md`
- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
- `docs/dev/onboarding/auth-rls-runbook.md`
- `docs/dev/onboarding/campus-weeks.md`
- `docs/dev/onboarding/day-0-setup.md`
- `docs/dev/onboarding/golden-path-first-pr.md`
- `docs/dev/onboarding/roles-and-personas.md`
- `mkdocs.yml`
