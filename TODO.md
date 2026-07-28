# TODO — ideias futuras

Ideias para evoluir a ferramenta. Nada aqui é compromisso; é um backlog para escolher a partir dele. Ao concluir um item, mover para o `CHANGELOG.md` via skill `versioning`.

## Ferramentas novas
- [ ] **Color scale** — gerar rampas (tints/shades) a partir de uma cor base, com contraste WCAG por par.
- [ ] **Shadow scale** — escala de elevação (box-shadow) coerente, do subtil ao pronunciado.
- [ ] **Radius scale** — escala de border-radius (none → pill).
- [ ] **Breakpoints** — referência de breakpoints comuns com preview de largura.

## Persistência e partilha
- [ ] Guardar as definições de cada ferramenta em `localStorage` (sobreviver a refresh).
- [ ] Codificar o estado no URL (`#`) para partilhar uma configuração exata sem servidor.
- [ ] Botão "Reset" por ferramenta (voltar aos defaults).

## Export
- [ ] Formatos extra no export: JSON (design tokens), SCSS `$vars`, Tailwind `theme.extend`.
- [ ] Descarregar como ficheiro (`.css` / `.json`) além do copy-to-clipboard.

## UX / A11y
- [ ] Atalhos de teclado (trocar de tab, abrir export, alternar tema).
- [ ] Focus trap dentro do modal de export e devolver o foco ao fechar.
- [ ] Texto de sample editável com opção de repor a frase original.

## Qualidade
- [ ] Suite mínima de testes (ex.: validar cálculo da escala e formatação de unidades) que corra offline.
- [ ] Ficheiro `.editorconfig` para normalizar EOL (o repo mistura LF/CRLF).
