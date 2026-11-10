# Meus Estudos — Frontend

Aplicação Angular para organizar estudos bíblicos e revisitas — cadastro, listagem e acompanhamento diário.

## Stack

- **Angular 21** (componentes standalone, signals, `loadComponent` lazy)
- **SCSS** como linguagem de estilos
- **Jest** + `jest-preset-angular` para testes (ambiente zoneless)
- Fonte **Lato** (Google Fonts)

## Começando

A aplicação consome a **Revisits & Studies Manager API** (ASP.NET Core + JWT).
A URL base fica em `src/environments/environment.ts` (`apiUrl`, padrão
`http://localhost:5000`) — ajuste para a porta onde a API estiver rodando.

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
    │   ├── auth/       # Login e cadastro (toggle "Entrar" / "Cadastrar")
    │   ├── home/       # Dashboard: estudos e revisitas do dia
    │   ├── studies/    # Listagem de estudos + cadastro via modal
    │   └── revisits/   # Listagem de revisitas + cadastro via modal
    ├── shared/
    │   ├── header/             # Cabeçalho (abre o menu lateral)
    │   ├── menu/               # Menu lateral (drawer) com navegação
    │   └── person-form-modal/  # Modal de cadastro reutilizável
    ├── core/
    │   ├── models.ts                   # DTOs da API + labels de dia da semana
    │   ├── auth.service.ts             # Login/registro, token JWT no localStorage
    │   ├── revisits-studies.service.ts # CRUD de /api/revisitAndStudies
    │   ├── auth.interceptor.ts         # Anexa Bearer token; logout em 401
    │   └── auth.guard.ts               # authGuard (privadas) e guestGuard (/auth)
    ├── app.routes.ts
    └── app.config.ts
```

## Rotas

| Rota        | Página                                       |
|-------------|----------------------------------------------|
| `/auth`     | Login / Cadastro (`guestGuard`)              |
| `/home`     | Home com resumo do dia (`authGuard`)         |
| `/estudos`  | Listagem de estudos (`authGuard`)            |
| `/revisitas`| Listagem de revisitas (`authGuard`)          |

Rotas protegidas exigem token JWT; sem token, redirecionam para `/auth`, e
`/auth` redireciona para `/home` quando já autenticado.

As rotas de listagem aceitam o query param `?novo=1`, que abre o modal de
cadastro automaticamente — é assim que os itens "Novo estudo" e "Nova revisita"
do menu lateral funcionam.

## Integração com a API

- **Auth**: `POST /api/Auth/register` → `POST /api/Auth/login` (cadastro já faz
  login automático). O token JWT fica em `localStorage` e é anexado pelo
  `authInterceptor` em todas as requisições; um `401` faz logout e volta para
  `/auth`. O nome do usuário é extraído do payload do JWT.
- **Registros**: `GET /api/revisitAndStudies?dayOfWeek=&type=` e `POST` no mesmo
  endpoint. `dayOfWeek` segue o enum da API (0 = domingo … 6 = sábado), igual ao
  retorno de `Date.getDay()` — a home filtra pelo dia atual com
  `new Date().getDay()`. `type` aceita `Study` ou `Revisit`.

## Componentes compartilhados

### `app-header`

Cabeçalho fixo no topo. Exibe o nome do usuário (`[userName]`, padrão
`'teste'`), o botão hambúrguer que abre o menu lateral e o atalho de sair.

### `app-menu`

Drawer lateral controlado por `[(open)]` (two-way binding com `model`).
Navegação: **Hoje**, **Estudos**, **Novo estudo**, **Revisitas**,
**Nova revisita** e **Sair**. O item da rota ativa recebe destaque.

### `app-person-form-modal`

Modal de cadastro de pessoa (usado tanto para estudos quanto revisitas),
controlado por `[(open)]`. Inputs:

| Input         | Descrição                              |
|---------------|----------------------------------------|
| `title`       | Título da página do modal              |
| `dayLabel`    | Label do campo de dia (select semanal) |
| `submitLabel` | Texto do botão de salvar               |

Emite `(saved)` com `PersonFormValue` (`name`, `age`, `dayOfWeek`, `address`,
`details`) ao submeter um formulário válido. Campos: Nome*, Idade, Dia
(select 0–6, pré-selecionado com `Date.getDay()`), Endereço* e Detalhes.

## Convenções

- Componentes standalone, sem sufixo `.component` no nome dos arquivos
  (`header.ts`, `home.page.ts`)
- Estado local com `signal`/`computed`; templates com a nova sintaxe de
  controle de fluxo (`@if`, `@for`)
- Estilos em SCSS com BEM (`bloco__elemento--modificador`), consumindo os
  design tokens do `styles.scss`
- Testes com Jest: um `*.spec.ts` por componente/página, seguindo o padrão
  `TestBed.configureTestingModule`

## Design tokens

Definidos como variáveis CSS em `src/styles.scss`, mobile-first:

| Variável                | Mobile    | Desktop (≥768px) |
|-------------------------|-----------|------------------|
| `--padding`             | 16px      | 24px             |
| `--gap`                 | 24px      | 32px             |
| `--radius`              | 6px       | 6px              |
| `--radius-lg`           | 14px      | 14px             |
| `--max-width`           | 1440px    | 1440px           |
| `--color-primary`       | `#5b3a88` |                  |
| `--color-primary-dark`  | `#47296e` |                  |
| `--color-primary-light` | `#7d5fb0` |                  |
| `--color-secondary`     | `#ffffff` |                  |

Header e conteúdo das páginas respeitam `--max-width: 1440px` centralizado.
Overlays usam `z-index` 100 (menu) e 200 (modal de cadastro).
