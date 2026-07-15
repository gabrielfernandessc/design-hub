# Arquitetura do Design Hub

## Visão Geral

O Design Hub é construído como um monorepo com Turborepo, usando Elysia no backend e TanStack no frontend.

## Estrutura de Aplicações

### apps/web

Aplicação principal do portal de chamados.

- **Framework**: TanStack Router + TanStack Query
- **SSR**: Server-Side Rendering habilitado
- **Estilo**: Tailwind CSS
- **Responsável**: Interface do usuário para designers e equipe

### apps/admin

Painel administrativo.

- **Framework**: TanStack Router + TanStack Query
- **SSR**: Server-Side Rendering habilitado
- **Estilo**: Tailwind CSS
- **Responsável**: Gerenciamento de usuários, configurações, métricas

## Estrutura de Pacotes

### packages/ui

Componentes de UI compartilhados entre as aplicações.

- Componentes React
- Hooks compartilhados
- Utilitários de UI
- Design tokens

### packages/config

Configurações compartilhadas.

- ESLint config
- TypeScript config
- Tailwind config
- Configurações de build

### packages/api-client

Cliente API tipado com Eden Treaty.

- Types gerados
- Hooks de API
- Validação de schemas
- Tratamento de erros

## Fluxo de Dados

```
Google Forms → Webhook/API → Elysia Backend → Database
                                      ↓
                              TanStack Query ← Frontend
                                      ↓
                              UI Components
```

### Fluxo de um Chamado

1. **Entrada**: Formulário Google Forms submetido
2. **Processamento**: Backend cria card/task
3. **Armazenamento**: Dados salvos no banco
4. **Notificação**: Equipe notificada
5. **Visualização**: Card aparece no Kanban
6. **Atribuição**: Designer pega o card
7. **Execução**: Trabalho realizado
8. **SLA**: Prazo monitorado

## API com Eden Treaty

Eden Treaty permite API tipada entre Elysia e o frontend.

```typescript
// Definição no backend
const app = new Elysia()
  .get('/api/cards', () => cards)
  .post('/api/cards', ({ body }) => createCard(body))

// Uso no frontend
import { eden } from '@design-hub/api-client'

const cards = await eden.api.cards.get()
```

## Autenticação

- **JWT Tokens**: Autenticação baseada em tokens
- **Session Management**: Gerenciamento de sessão no servidor
- **Role-Based Access**: Controle de acesso baseado em papel

## Banco de Dados

- **ORM**: Drizzle ou Prisma (a definir)
- **Banco**: PostgreSQL
- **Migrations**: Gerenciadas pelo ORM

## Deploy

- **Plataforma**: Vercel ou Railway
- **CI/CD**: GitHub Actions
- **Environment Variables**: Gerenciadas por plataforma

## Segurança

- **HTTPS**: Obrigatório em produção
- **CORS**: Configurado por domínio
- **Rate Limiting**: Proteção contra abuso
- **Input Validation**: Validação em todas as entradas
