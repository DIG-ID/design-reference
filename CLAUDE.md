# Design Reference Tool

Ferramenta offline (single-file HTML) com duas tabs:
1. **Spacing Grid** — escala de espaçamento 4pt/8pt com px/rem/pt, copy-on-click, export CSS vars
2. **Type Scale** — gerador de escala tipográfica (ratio, base size, REM/PX/PT), estilo typescale.com

## Regras
- Manter tudo num único ficheiro `index.html` (HTML + CSS + JS inline)
- Zero dependências externas / CDNs — tem de funcionar 100% offline
- Só system fonts
- Vanilla JS, sem frameworks
- Atualizar o `CHANGELOG.md` a cada alteração, seguindo SemVer (formato Keep a Changelog, ver regras no topo do ficheiro)