# Changelog

All notable changes to this tool are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

- **MAJOR** (`1.0.0` → `2.0.0`) — structural or breaking changes (redesign, feature removal, changes requiring manual intervention).
- **MINOR** (`1.0.0` → `1.1.0`) — new features / implementations (new tab, new tool, new section).
- **PATCH** (`1.0.0` → `1.0.1`) — bug fixes and small adjustments that do not add functionality.

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
