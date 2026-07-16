# codeowners-branching-policy

**Date:** 2026-07-16T151415Z
**User:** miguelventura1123@gmail.com

---

## User Prompt

_Verbatim user input. Multiple messages are separated by ._

```
i want to set up a rule set for github:
1) junior devs are only allowed to branch off from dev, make their cahnges, and then make a pr to develop with the approval of someone from the senior team. they are never allowed to touch main
2) senior developers are allowed to write directly on dev and main, but to merge dev into main requires the approval of 2 members of the senior team. 

While i dont like the fact that senior team will be able to directly write to main, i wish to minimize the time to make hotfixes incase a small but important bug slips by. 

How would you reccomend putting this into github?

---

ruleset are in place except for anything relating to codeowners. Please set that up, and add to the documentation 1) what the structure is, and 2) in the documentation describing how to make your first pr, describe the waht needs to happen before their edits hit develop

---

its Senior Developers and Junior Developers

---

updated gh auth, please check now

---

we'll assume it works

---

looks good, log it
```

---

## Purpose

Set up CODEOWNERS and document develop/main review workflow for Senior and Junior Developers

---

## Agent Response Summary

_What the agent did (not a recap of user input)._

Recommended GitHub teams + rulesets for develop/main (junior PR path, senior push/bypass, 2 approvals for main). Implemented .github/CODEOWNERS for @College-Success-Scholars/senior-developers; added docs/dev/onboarding/branching-and-reviews.md; updated golden-path-first-pr with the branch→PR→Senior Developer approval→develop checklist; wired onboarding README, ask-and-dont-touch, handbook home, and mkdocs. Corrected team slugs from seniors/juniors to senior-developers / junior-developers. Could not verify org teams via gh (api.github.com blocked in agent sandbox / keyring); user elected to assume CODEOWNERS works and confirmed docs look good.

---

## Code Changes

- `docs/dev/README.md`
- `docs/dev/onboarding/README.md`
- `docs/dev/onboarding/ask-and-dont-touch.md`
- `docs/dev/onboarding/golden-path-first-pr.md`
- `mkdocs.yml`
