# Atividade ReactJs – UCSAL

Aplicação responsiva em React com 6 componentes: **Acordeão, Paginação, Barra de Progresso, Abas, Menu Suspenso e Toast**.
Estilização com **styled-components** (sem arquivos CSS).
Desafio extra: **Context API** (`ToastContext`) para as notificações globais.

## Como rodar no GitHub Codespaces
1. Crie um repositório no GitHub e envie estes arquivos.
2. Clique em **Code → Codespaces → Create codespace on main**.
3. No terminal do Codespaces:
   ```bash
   npm install
   npm run dev
   ```
4. Abra a porta 5173 quando o Codespaces avisar.

## Estrutura
```
src/
  main.jsx               ponto de entrada (envolve o App com ToastProvider)
  App.jsx                componente principal, orquestra os demais
  styles/                theme.js, GlobalStyle.js e shared.js (botão, etc.)
  context/ToastContext.jsx   estado global dos toasts (Context API)
  components/
    Accordion.jsx  Pagination.jsx  ProgressBar.jsx
    Tabs.jsx       Dropdown.jsx    Toast.jsx
```

## Conceitos para citar no vídeo
- **Props**: `items` (Accordion), `totalPages/currentPage/onPageChange` (Pagination), `value` (ProgressBar), `tabs` (Tabs), `options` (Dropdown).
- **useState**: item aberto, aba ativa, menu aberto, página atual, progresso.
- **useEffect**: timer do upload, fechamento automático do Toast, clique fora do Dropdown (com limpeza).
- **Eventos**: onClick, onKeyDown.
- **Context API**: `useToast()` dispara toasts de qualquer componente.
- **Acessibilidade**: tags semânticas, `aria-expanded`, `role="progressbar"`, `role="tablist"`, `aria-live`, skip link, foco visível, navegação por teclado.
- **styled-components**: estilos dentro de cada componente, tema via `ThemeProvider`, props transitórias (`$open`, `$active`, `$type`) para variar o visual conforme o state.
- **Responsividade**: mobile-first com breakpoints em 640px e 960px (definidos em `theme.media`).
