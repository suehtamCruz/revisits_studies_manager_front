# Meus Estudos — Frontend

Aplicação Angular para organizar estudos e revisitas.

## Stack

- **Angular 21** (componentes standalone, signals, `loadComponent` lazy)
- **SCSS** como linguagem de estilos
- **Jest** + `jest-preset-angular` para testes (ambiente zoneless)
- Fonte **Lato** (Google Fonts)

## Começando

```bash
npm install
npm start        # dev server em http://localhost:4200
```

Outros comandos:

```bash
npm run build    # build de produção em dist/
npm test         # testes com Jest
npm run watch    # build em modo watch (development)
```

## Estrutura

```
src/
└── app/
    ├── pages/
    │   ├── auth/      # Login e cadastro (toggle "Entrar" / "Cadastrar")
    │   └── home/      # Dashboard: estudos e revisitas do dia
    ├── shared/
    │   └── header/    # Cabeçalho da aplicação
    ├── app.routes.ts  # '' -> /auth, /home, '**' -> /auth
    └── app.config.ts
```

## Rotas

| Rota    | Página                                   |
|---------|------------------------------------------|
| `/auth` | Login / Cadastro (redirecionamento padrão) |
| `/home` | Home com resumo do dia                     |

## Design tokens

Definidos como variáveis CSS em `src/styles.scss`, mobile-first:

| Variável                | Mobile | Desktop (≥768px) |
|-------------------------|--------|------------------|
| `--padding`             | 16px   | 24px             |
| `--gap`                 | 24px   | 32px             |
| `--radius`              | 6px    | 6px              |
| `--max-width`           | 1440px | 1440px           |
| `--color-primary`       | `#5b3a88` |               |
| `--color-secondary`     | `#ffffff` |               |

Header e conteúdo das páginas respeitam `--max-width: 1440px` centralizado.
