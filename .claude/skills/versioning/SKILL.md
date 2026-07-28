---
name: versioning
description: Release the current working changes — inspect the diff, pick the SemVer bump, write the CHANGELOG entry, and commit. Use when the user says "versiona", "faz o release", "documenta e commita", or after finishing a change that should be recorded.
---

# Versioning

Turns the pending working changes into a documented release: one CHANGELOG entry + one commit, following this project's rules.

## When to use
The user finished (or asked you to finish) a change and wants it recorded — e.g. "versiona isto", "faz o release", "documenta no changelog e commita".

## Rules that apply
- SemVer per the table at the top of `CHANGELOG.md`:
  - **MAJOR** — structural or breaking changes (redesign, feature removal, changes needing manual intervention, e.g. new files that must travel with `index.html`).
  - **MINOR** — new features (new tab, tool, section).
  - **PATCH** — bug fixes and small adjustments that add no functionality.
- Format: Keep a Changelog (`### Added` / `### Changed` / `### Fixed` / `### Removed`).
- Commits: **no co-author line** (project preference).
- Date: use the real current date (from context), format `YYYY-MM-DD`.

## Steps
1. **Inspect** — run `git status --short` and `git diff` (plus `git diff --staged`) to see everything pending. If nothing changed, stop and say so.
2. **Classify** — decide the bump (MAJOR / MINOR / PATCH) from the diff using the rules above. Read the last version in `CHANGELOG.md` and compute the next one.
3. **Document** — add a new `## [x.y.z] - YYYY-MM-DD` section at the top of the entries (directly above the most recent one), grouped by Added/Changed/Fixed/Removed. Describe user-facing impact, not file-by-file mechanics. Mention the version in nothing else — there is no version field elsewhere in the project.
4. **Confirm the bump** — if the change could reasonably be classified two ways (e.g. an internal refactor that is arguably MAJOR because of distribution impact), briefly state your choice and why in the response. Do not block on it unless the user is present and it's genuinely ambiguous.
5. **Commit** — `git add -A`, then one commit. Subject line: short imperative summary with the version in parens, e.g. `Add color scale tool (v2.1.0)`. Body: 1–3 lines on what changed and why. **Never** add a `Co-Authored-By` line. Do not push unless asked.
6. **Report** — give the commit hash and the version, one or two sentences.

## Notes
- One release = one commit. Don't split into several unless the user asks.
- Don't create a branch; this project commits straight to `main` (see its history).
- If the working tree mixes unrelated changes, note it but still version them together unless told otherwise.
