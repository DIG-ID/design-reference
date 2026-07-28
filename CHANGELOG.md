# Changelog

All notable changes to this tool are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

- **MAJOR** (`1.0.0` → `2.0.0`) — structural or breaking changes (redesign, feature removal, changes requiring manual intervention).
- **MINOR** (`1.0.0` → `1.1.0`) — new features / implementations (new tab, new tool, new section).
- **PATCH** (`1.0.0` → `1.0.1`) — bug fixes and small adjustments that do not add functionality.

## [2.3.0] - 2026-07-28

### Added
- Content Playbook — **Client brief** export: a blank, client-facing brief (one section per page, with instructions) that asks for facts and bullet points rather than finished copy, ready to send to the client.
- Content Playbook — **content-intake guidance** in the Setup stage: a "Getting content from the client" tips block plus checklist items for briefing the client and gathering existing material.

## [2.2.1] - 2026-07-28

### Changed
- Reworded the content-intake references in the Gate Checklist and Content Playbook: the client contributes through an agreed channel (brief or document), and CMS editing is deferred to after go-live — instead of implying the client writes into the site during the project.

## [2.2.0] - 2026-07-28

### Added
- **Content Playbook** tab — a personal do-and-deliver guide for whoever owns content on a project (content lead / copywriter), written to be usable even by non-copywriters.
  - Project setup (decide once) plus per-page stages (Prepare → Write → SEO → Convert → Legal → QA & handoff) as a sub-navigation stepper.
  - Each stage has a plain-language guide ("what good looks like" + why it matters), a good-vs-bad example, a checklist of do's, and a clear deliverable.
  - Per-page worksheet (Part C: goal, audience, message, CTA, title, meta, H1…), with multiple named pages, each saved in `localStorage`.
  - Export a page's handoff (worksheet + checklist state) as Markdown or a print/PDF sheet.

### Fixed
- Print handlers now clear the other tool's report container before printing, so a stale report can't print alongside the current one.

## [2.1.0] - 2026-07-28

### Added
- **Gate Checklist** tab — an interactive gated checklist for web projects, sourced from `website-content-checklist.md`.
  - Six ordered phases (Kickoff & Scope → Content → Design → Development → Pre-launch QA → Go-live) as a sub-navigation stepper below the main nav.
  - Each phase shows a checklist grouped by section, with required (gating) vs recommended items, live progress (x/y required) and an advisory gate status (BLOCKED / READY TO CLOSE).
  - Close a phase with a "closed by" name + timestamp for sign-off, and reopen it; an advisory heads-up when the previous phase isn't closed yet (never hard-blocked).
  - Optional notes per phase; state persisted per run in `localStorage` with a Reset action.
  - Export the report as Markdown or as a print/PDF-friendly document.

## [2.0.1] - 2026-07-28

### Added
- `TODO.md` with a curated backlog of future ideas (new tools, persistence, export formats, a11y).
- `versioning` project skill (`.claude/skills/versioning/`) that inspects the diff, picks the SemVer bump, writes the CHANGELOG entry and commits (no co-author).

## [2.0.0] - 2026-07-28

### Changed
- **Modular architecture** — the single `index.html` was split into external files (no build step, still 100% offline via classic scripts + `window.DR`). The `css/` and `js/` folders must now travel alongside `index.html`.
  - `css/`: `base.css` (tokens, themes, reset), `layout.css` (app shell, tabs, grid), `components.css` (fields, segmented controls, buttons, toast, modal), `spacing.css`, `type-scale.css`.
  - `js/`: `theme-init.js` (pre-paint theme), `utils.js` (shared `window.DR` helpers), `app.js` (theme/tabs/modal), `spacing.js`, `type-scale.js`.

### Added
- Skip-to-content link for keyboard users and `aria-labelledby` on the export dialog.
- `DR.escapeHtml` helper; type-scale sample text is now escaped before injection.

## [1.4.0] - 2026-07-21

### Added
- Draggable splitter between the scale list and the page preview — resizable vertically in the Below layout and horizontally in the Side layout, with keyboard support (arrow keys, Shift for bigger steps) and per-layout position memory.

### Changed
- Type Scale: the scale list and the page preview now live in two separate cards instead of sharing one container.
- Controls reorganized: the REM/PX/PT unit toggle sits in the scale card; template, layout, device and fullscreen controls sit in the preview card header.
- Layout (Below/Side), device (Desktop/Mobile), fullscreen and close buttons now use inline Lucide icons (ISC license) — still zero external dependencies.

## [1.3.0] - 2026-07-21

### Added
- Page preview in the Type Scale tool, always visible alongside the scale list: landing page or blog post template (dropdown) rendered live with the current scale (sizes, fonts, weights, line-heights, letter-spacing).
- Layout toggle Below / Side (preview under or next to the scale list), device toggle Desktop / Mobile (375px), and fullscreen mode (closes with Esc).

### Changed
- Fully fluid layout: removed the 1400px max-width so the tool always uses the whole viewport.

## [1.2.0] - 2026-07-21

### Added
- 16pt option in the Spacing Grid base unit (alongside 4pt and 8pt), with its own curated design scale.

### Changed
- Removed the token column from the spacing table — redundant with the step multiplier; token names (`--space-X`) remain in the CSS variables export.

## [1.1.0] - 2026-07-21

### Added
- Dark mode with sun/moon toggle in the header.
- Theme persistence via `localStorage`; first visit follows the OS preference (`prefers-color-scheme`).
- Inline `<head>` script that applies the theme before first paint (no flash of wrong theme).
- New CSS variables (`--surface-2`, `--border-soft`, `--flash`) and `color-scheme` for native form controls.

### Changed
- Renamed `design-reference.html` to `index.html` to match the project rules in `CLAUDE.md`.
- Replaced all hardcoded colors (inputs, primary button, toast, table backgrounds, copy flash) with theme variables.

## [1.0.0] - 2026-07-21

### Added
- Initial release — offline single-file tool with two tabs:
  - **Spacing Grid**: 4pt/8pt scale with px/rem/pt values, curated or all-multiples mode, bar/square preview, copy-on-click, export as CSS variables.
  - **Type Scale**: typographic scale generator (base size, ratio presets + custom, REM/PX/PT), body/heading font settings, editable samples, copy-on-click, export as CSS variables.
- Zero external dependencies, system fonts only, vanilla JS.
