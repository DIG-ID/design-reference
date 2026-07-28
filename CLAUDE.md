# Design Reference Tool

Ferramenta offline (single-file HTML) com duas tabs:
1. **Spacing Grid** — escala de espaçamento 4pt/8pt com px/rem/pt, copy-on-click, export CSS vars
2. **Type Scale** — gerador de escala tipográfica (ratio, base size, REM/PX/PT), estilo typescale.com

## Arquitetura
Estrutura modular, sem build step (scripts clássicos + `window.DR`), para continuar a funcionar por duplo-clique via `file://`. As pastas `css/` e `js/` têm de viajar sempre ao lado do `index.html`.

- `index.html` — só markup + `<link>`/`<script>` para os ficheiros externos
- `css/` — `base.css` (tokens/temas/reset), `layout.css` (shell/tabs/grid), `components.css` (campos, segmented, botões, toast, modal), `spacing.css`, `type-scale.css`
- `js/` — `theme-init.js` (aplica tema antes do 1º paint, síncrono no `<head>`), `utils.js` (namespace `window.DR`: helpers partilhados), `app.js` (tema/tabs/modal), `spacing.js` (ferramenta Spacing Grid), `type-scale.js` (ferramenta Type Scale)

Os ficheiros JS das ferramentas são `defer` e dependem do `window.DR` do `utils.js` (que carrega primeiro).

## Regras
- Zero dependências externas / CDNs — tem de funcionar 100% offline (sem servidor, por `file://`)
- Só system fonts
- Vanilla JS, sem frameworks, sem ES modules (bloqueados por `file://`) — usar scripts clássicos e o namespace `window.DR`
- Escapar sempre texto do utilizador (`DR.escapeHtml`) antes de injetar via `innerHTML`
- Atualizar o `CHANGELOG.md` a cada alteração, seguindo SemVer (formato Keep a Changelog, ver regras no topo do ficheiro)