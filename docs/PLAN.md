# Planejamento - Design Hub

## Decisões Tomadas (Grill-Me Session)

| Categoria             | Decisão                                                                 | Justificativa                                          |
| --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| **Usuário Principal** | Equipe de design interna                                                | Portal de chamados para designers gerenciarem demandas |
| **Objetivo**          | Gestão completa de demandas                                             | Receber, atribuir, acompanhar e entregar com SLA       |
| **Modelo de Dados**   | Card, User, Category, Comment, Attachment, Project, Notifications, Tags | Entidades mínimas para sistema de chamados             |
| **API**               | REST + Eden Treaty                                                      | Tipagem automática end-to-end com Elysia               |
| **Banco de Dados**    | PostgreSQL + Drizzle                                                    | Robusto, maduro, leve com Bun                          |
| **Deployment**        | Vercel + Railway                                                        | Vercel para SSR, Railway para API                      |

---

## Fase 1: Infraestrutura (Semana 1)

### 1.1 Configuração do Ambiente

- [ ] Configurar PostgreSQL (Railway ou Supabase)
- [ ] Criar `.env` com credenciais do banco
- [ ] Configurar Drizzle ORM
- [ ] Criar schema inicial do banco

### 1.2 Schema do Banco de Dados

```sql
-- Tabelas principais
users          -- Usuários da equipe
projects       -- Projetos para agrupar cards
categories     -- Tipos de demanda
cards          -- Demandas de design
tags           -- Tags flexíveis
card_tags      -- Relação card-tag
comments       -- Comentários nos cards
attachments    -- Anexos dos cards
notifications  -- Alertas e notificações
```

### 1.3 Configuração do Turborepo

- [ ] Configurar `turbo.json` (já feito)
- [ ] Configurar pipelines de build
- [ ] Configurar cache

---

## Fase 2: Backend (Semana 2)

### 2.1 API com Elysia

#### Endpoints de Autenticação

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

#### Endpoints de Users

```
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

#### Endpoints de Projects

```
GET    /api/projects
GET    /api/projects/:id
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
```

#### Endpoints de Cards

```
GET    /api/cards
GET    /api/cards/:id
POST   /api/cards
PUT    /api/cards/:id
DELETE /api/cards/:id
PATCH  /api/cards/:id/status
PATCH  /api/cards/:id/assign
```

#### Endpoints de Comments

```
GET    /api/cards/:cardId/comments
POST   /api/cards/:cardId/comments
DELETE /api/comments/:id
```

#### Endpoints de Attachments

```
GET    /api/cards/:cardId/attachments
POST   /api/cards/:cardId/attachments
DELETE /api/attachments/:id
```

#### Endpoints de Tags

```
GET    /api/tags
POST   /api/tags
DELETE /api/tags/:id
```

#### Endpoints de Notifications

```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
```

#### Endpoints de Google Forms Webhook

```
POST   /api/webhook/google-forms
```

### 2.2 Integração com Google Forms

- [ ] Criar endpoint de webhook
- [ ] Mapear campos do formulário para Card
- [ ] Validar dados recebidos
- [ ] Criar card automaticamente
- [ ] Notificar equipe

### 2.3 Autenticação

- [ ] JWT tokens
- [ ] Middleware de autenticação
- [ ] Controle de acesso por role

---

## Fase 3: Frontend (Semanas 3-4)

### 3.1 Layout Principal

```
┌─────────────────────────────────────────────────────┐
│  Header (Logo, Nav, User Menu)                      │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  Sidebar │         Main Content                     │
│          │                                          │
│  - Home  │    ┌─────────────────────────────────┐   │
│  - Cards │    │                                 │   │
│  - Projects│  │    Kanban Board / Card View     │   │
│  - Tags  │    │                                 │   │
│  - Settings│   │                                 │   │
│          │    └─────────────────────────────────┘   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### 3.2 Páginas

#### Dashboard (`/`)

- Cards recentes
- Cards atribuídos a mim
- Cards próximos do SLA
- Métricas rápidas

#### Kanban Board (`/board`)

- Colunas: Novo, Em Progresso, Aguardando Feedback, Concluído
- Drag and drop para mover cards
- Filtros por categoria, prioridade, responsável

#### Lista de Cards (`/cards`)

- Visualização em tabela
- Busca e filtros avançados
- Ordenação por qualquer coluna

#### Detalhe do Card (`/cards/:id`)

- Informações do card
- Histórico de status
- Comentários
- Anexos
- Atribuição
- SLA

#### Projetos (`/projects`)

- Lista de projetos
- Cards por projeto

#### Configurações (`/settings`)

- Perfil do usuário
- Categorias
- Tags
- SLA config
- Notificações

### 3.3 Componentes

#### UI Components (packages/ui)

- Button
- Card
- Input
- Select
- Badge
- Avatar
- Modal
- Dropdown
- Toast
- Tooltip

#### Layout Components

- Header
- Sidebar
- MainLayout
- PageHeader

#### Feature Components

- KanbanBoard
- KanbanColumn
- KanbanCard
- CardDetail
- CardForm
- CommentList
- CommentForm
- AttachmentList
- UserSelect
- CategorySelect
- TagSelect
- SLAIndicator

---

## Fase 4: Funcionalidades Especiais (Semana 5)

### 4.1 SLA Configurável

- [ ] Configurar SLA por categoria
- [ ] Configurar SLA por prioridade
- [ ] Alertas de SLA próximo
- [ ] Alertas de SLA vencido
- [ ] Pausa de SLA (aguardando feedback)

### 4.2 Notificações

- [ ] Notificação de novo card
- [ ] Notificação de atribuição
- [ ] Notificação de SLA
- [ ] Notificação de comentário
- [ ] Notificação de status
- [ ] Notificações in-app
- [ ] Notificações por email (futuro)

### 4.3 Drag and Drop

- [ ] Mover cards entre colunas
- [ ] Reordenar cards dentro da coluna
- [ ] Feedback visual
- [ ] Otimimização de performance

---

## Fase 5: Pagamentos (Semana 6)

### 5.1 Integração com Stripe

- [ ] Criar produtos no Stripe
- [ ] Criar preços
- [ ] Checkout session
- [ ] Webhook de pagamentos
- [ ] Gerenciar assinaturas

### 5.2 Planos

#### Starter (R$ 97/mês)

- 1 usuário
- 50 cards/mês
- 1 projeto
- SLA básico

#### Pro (R$ 197/mês)

- 5 usuários
- 200 cards/mês
- 10 projetos
- SLA avançado
- Notificações por email

#### Enterprise (R$ 497/mês)

- Usuários ilimitados
- Cards ilimitados
- Projetos ilimitados
- SLA customizado
- Suporte prioritário
- API access

---

## Fase 6: Deploy (Semana 7)

### 6.1 Frontend (Vercel)

- [ ] Configurar projeto no Vercel
- [ ] Configurar build command
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínio

### 6.2 Backend (Railway)

- [ ] Configurar projeto no Railway
- [ ] Configurar PostgreSQL
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínio

### 6.3 CI/CD

- [ ] GitHub Actions para testes
- [ ] Deploy automático
- [ ] Environment variables

---

## Cronograma

| Semana | Fase           | Entregável                    |
| ------ | -------------- | ----------------------------- |
| 1      | Infraestrutura | Schema do banco, configuração |
| 2      | Backend        | API completa, webhooks        |
| 3      | Frontend I     | Layout, components, dashboard |
| 4      | Frontend II    | Kanban, card detail, filtros  |
| 5      | Especiais      | SLA, notificações, drag-drop  |
| 6      | Pagamentos     | Stripe integration            |
| 7      | Deploy         | Produção rodando              |

---

## Stack Final

```
Runtime:      Bun
Backend:      Elysia + Eden Treaty
Frontend:     TanStack Router + TanStack Query
Styling:      Tailwind CSS
Database:     PostgreSQL
ORM:          Drizzle
Payments:     Stripe
Monorepo:     Turborepo
Deploy:       Vercel (frontend) + Railway (backend)
```

---

## Próximos Passos Imediatos

1. **Configurar PostgreSQL** no Railway
2. **Criar schema do banco** com Drizzle
3. **Implementar API** de users e auth
4. **Criar layout** do frontend
5. **Implementar Kanban** board

---

## Riscos e Mitigações

| Risco                   | Mitigação                    |
| ----------------------- | ---------------------------- |
| SLA complexo demais     | Começar simples, iterar      |
| Drag and drop lento     | Usar biblioteca otimizada    |
| Integração Google Forms | Webhook simples primeiro     |
| Pagamentos complexos    | Stripe templates prontos     |
| Deploy complicado       | Vercel + Railway são simples |

---

## Sucesso

O projeto será considerado um sucesso quando:

1. ✅ Equipe pode receber pedidos via Google Forms
2. ✅ Cards são criados automaticamente
3. ✅ Designers podem atribuir e gerenciar cards
4. ✅ SLA é monitorado e alertado
5. ✅ Sistema está em produção e sendo usado

---

## Documentação Detalhada

Para mais detalhes, consulte:

- **[DETAILED-PLAN.md](./DETAILED-PLAN.md)** - Planejamento completo com tarefas, dependências e estimativas
- **[DAILY-PLAN.md](./DAILY-PLAN.md)** - Plano de trabalho diário (40 dias)
- **[PROJECT-STATUS.md](./PROJECT-STATUS.md)** - Status atual do projeto
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura do sistema
- **[BUSINESS-RULES.md](./BUSINESS-RULES.md)** - Regras de negócio
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guia de deploy

---

_Documento principal de planejamento_
_Última atualização: 2024_
