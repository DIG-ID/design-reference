# Design Reference Tool

Ferramenta offline (modular, sem build) com quatro tabs:
1. **Spacing Grid** — escala de espaçamento 4pt/8pt com px/rem/pt, copy-on-click, export CSS vars
2. **Type Scale** — gerador de escala tipográfica (ratio, base size, REM/PX/PT), estilo typescale.com
3. **Gate Checklist** — checklist gated para projetos web (visão PM/team); sub-navegação por fases (Kickoff → Go-live), gates informativos (BLOCKED/READY), fechar/reabrir fase com registo, notas, estado em localStorage, export Markdown + print.
4. **Content Playbook** — guia pessoal do-e-entrega para quem é responsável pelo conteúdo (content lead/copywriter, mesmo sem ser do ofício). Fases com dois scopes: **site-wide** (uma vez — Project setup + Legal & compliance) e **por página** (Prepare → QA, numeradas). Cada passo tem guia ("what good looks like" + porquê), exemplo bom/mau, checklist e deliverable; o Setup inclui guidance de content-intake do cliente. Worksheet por página (Part C) preenchível, múltiplas páginas. Exports conforme o scope: handoff da página (worksheet + checklist da página) ou relatório do projeto (checks site-wide), em Markdown + print; e "Client brief" (template em branco para o cliente).

As tabs 3 e 4 partilham conteúdo com origem em `website-content-checklist.md`.

## Arquitetura
Estrutura modular, sem build step (scripts clássicos + `window.DR`), para continuar a funcionar por duplo-clique via `file://`. As pastas `css/` e `js/` têm de viajar sempre ao lado do `index.html`.

- `index.html` — só markup + `<link>`/`<script>` para os ficheiros externos
- `css/` — `base.css` (tokens/temas/reset), `layout.css` (shell/tabs/grid), `components.css` (campos, segmented, botões, toast, modal), `spacing.css`, `type-scale.css`, `gate-checklist.css`, `content-playbook.css` (as duas últimas incluem CSS de print)
- `js/` — `theme-init.js` (aplica tema antes do 1º paint, síncrono no `<head>`), `utils.js` (namespace `window.DR`: helpers partilhados), `app.js` (tema/tabs/modal), `spacing.js` (Spacing Grid), `type-scale.js` (Type Scale), `gate-checklist.js` (Gate Checklist), `content-playbook.js` (Content Playbook — conteúdo do guia no data model no topo do ficheiro)

Cada tool tem o seu contentor de print (`#gc-print`, `#cp-print`); cada handler de print limpa o do outro antes de `window.print()`.

Os ficheiros JS das ferramentas são `defer` e dependem do `window.DR` do `utils.js` (que carrega primeiro).

Navegação single-page com **deep-linking por hash** (`app.js`): `#spacing|type|gates|playbook` seleciona a tab; cliques e back/forward passam todos pelo `hashchange`. Decisão consciente de não separar em HTMLs distintos — sem build step, o shell teria de ser duplicado (partials por `fetch` não funcionam via `file://`).

## Regras
- Zero dependências externas / CDNs — tem de funcionar 100% offline (sem servidor, por `file://`)
- Só system fonts
- Vanilla JS, sem frameworks, sem ES modules (bloqueados por `file://`) — usar scripts clássicos e o namespace `window.DR`
- Escapar sempre texto do utilizador (`DR.escapeHtml`) antes de injetar via `innerHTML`
- Atualizar o `CHANGELOG.md` a cada alteração, seguindo SemVer (formato Keep a Changelog, ver regras no topo do ficheiro)