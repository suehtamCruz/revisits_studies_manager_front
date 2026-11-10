# Meus Estudos — Frontend

Aplicação Angular para organizar estudos bíblicos e revisitas — cadastro, listagem e acompanhamento diário.

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
    │   ├── auth/       # Login e cadastro (toggle "Entrar" / "Cadastrar")
    │   ├── home/       # Dashboard: estudos e revisitas do dia
    │   ├── studies/    # Listagem de estudos + cadastro via modal
    │   └── revisits/   # Listagem de revisitas + cadastro via modal
    ├── shared/
    │   ├── header/             # Cabeçalho (abre o menu lateral)
    │   ├── menu/               # Menu lateral (drawer) com navegação
    │   └── person-form-modal/  # Modal de cadastro reutilizável
    ├── app.routes.ts
    └── app.config.ts
```

## Rotas

| Rota        | Página                                       |
|-------------|----------------------------------------------|
| `/auth`     | Login / Cadastro (redirecionamento padrão)   |
| `/home`     | Home com resumo do dia                       |
| `/estudos`  | Listagem de estudos                          |
| `/revisitas`| Listagem de revisitas                        |

As rotas de listagem aceitam o query param `?novo=1`, que abre o modal de
cadastro automaticamente — é assim que os itens "Novo estudo" e "Nova revisita"
do menu lateral funcionam.

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

Emite `(saved)` com `PersonFormValue` (`name`, `age`, `day`, `address`,
`details`) ao submeter um formulário válido. Campos: Nome*, Idade, Dia
(pré-selecionado com o dia atual), Endereço e Detalhes.

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
