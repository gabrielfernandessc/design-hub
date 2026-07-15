# Planejamento Detalhado do Desenvolvimento - Design Hub

## Visão Geral

Este documento detalha todas as tarefas necessárias para o desenvolvimento do Design Hub, incluindo dependências, estimativas de tempo, critérios de aceitação e especificações técnicas.

---

## Épicas e Tarefas

### ÉPICA 1: Infraestrutura e Setup

#### Tarefa 1.1: Configurar Ambiente de Desenvolvimento

**Prioridade**: Alta | **Estimativa**: 2h | **Dependências**: Nenhuma

**Descrição**:
Configurar o ambiente local de desenvolvimento com todas as ferramentas necessárias.

**Subtarefas**:

- [ ] Instalar Bun (v1.3.14+)
- [ ] Configurar ESLint com regras TypeScript
- [ ] Configurar Prettier para formatação
- [ ] Configurar Git hooks (husky + lint-staged)
- [ ] Criar `.editorconfig`

**Critérios de Aceitação**:

- Bun instalado e funcionando
- Linting executa sem erros
- Formatação automática ao salvar
- Git hooks impedem commit com erros

**Arquivos Afetados**:

```
.design-hub/
├── .eslintrc.js
├── .prettierrc
├── .editorconfig
├── .husky/
│   └── pre-commit
└── package.json (scripts)
```

---

#### Tarefa 1.2: Configurar Turborepo

**Prioridade**: Alta | **Estimativa**: 3h | **Dependências**: 1.1

**Descrição**:
Configurar o monorepo com Turborepo para gerenciar múltiplos packages.

**Subtarefas**:

- [ ] Criar `turbo.json` com pipelines
- [ ] Configurar cache de build
- [ ] Configurar dependências entre packages
- [ ] Criar scripts de desenvolvimento
- [ ] Testar hot reload entre packages

**Critérios de Aceitação**:

- `bun run dev` inicia todos os apps
- Mudanças em packages são refletidas nos apps
- Build é cacheado corretamente
- `bun run build` funciona em todos os packages

**Especificação Técnica**:

```json
// turbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

#### Tarefa 1.3: Configurar PostgreSQL

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 1.1

**Descrição**:
Configurar o banco de dados PostgreSQL e o ORM Drizzle.

**Subtarefas**:

- [ ] Criar conta no Railway
- [ ] Criar projeto PostgreSQL
- [ ] Copiar URL de conexão
- [ ] Configurar `.env` com `DATABASE_URL`
- [ ] Instalar `drizzle-orm` e `drizzle-kit`
- [ ] Criar `drizzle.config.ts`
- [ ] Testar conexão com banco

**Critérios de Aceitação**:

- Conexão com banco funciona
- `drizzle-kit generate` executa sem erros
- `drizzle-kit push` cria tabelas
- Drizzle Studio abre e mostra tabelas

**Especificação Técnica**:

```typescript
// packages/config/drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

---

#### Tarefa 1.4: Criar Schema do Banco

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 1.3

**Descrição**:
Definir e implementar o schema completo do banco de dados.

**Subtarefas**:

- [ ] Criar tabela `users`
- [ ] Criar tabela `projects`
- [ ] Criar tabela `categories`
- [ ] Criar tabela `cards`
- [ ] Criar tabela `tags`
- [ ] Criar tabela `card_tags`
- [ ] Criar tabela `comments`
- [ ] Criar tabela `attachments`
- [ ] Criar tabela `notifications`
- [ ] Criar migrations iniciais
- [ ] Seed dados de teste

**Critérios de Aceitação**:

- Todas as tabelas criadas corretamente
- Relacionamentos funcionam
- Migrations executam sem erros
- Dados de teste inseridos

**Especificação Técnica**:

```typescript
// packages/config/src/schema/users.ts
import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 500 }),
  role: varchar('role', { length: 50 }).notNull().default('designer'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

**Diagrama ER**:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │   projects  │     │ categories  │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ name        │     │ name        │
│ name        │     │ description │     │ color       │
│ password    │     │ color       │     │ slaHours    │
│ role        │     │ ownerId(FK) │     └─────────────┘
└─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────────────────────────────┐
│              cards                  │
├─────────────────────────────────────┤
│ id (PK)                             │
│ title                               │
│ description                         │
│ status                              │
│ priority                            │
│ requesterName                       │
│ requesterEmail                      │
│ dueDate                             │
│ slaStartedAt                        │
│ slaPausedAt                         │
│ assigneeId (FK → users)             │
│ projectId (FK → projects)           │
│ categoryId (FK → categories)        │
│ sortOrder                           │
│ createdAt                           │
│ updatedAt                           │
└─────────────────────────────────────┘
       │
       ├───────────────┬───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  comments   │ │attachments  │ │  card_tags  │
├─────────────┤ ├─────────────┤ ├─────────────┤
│ id (PK)     │ │ id (PK)     │ │ cardId (FK) │
│ content     │ │ filename    │ │ tagId (FK)  │
│ cardId (FK) │ │ url         │ └─────────────┘
│ authorId(FK)│ │ cardId (FK) │        │
└─────────────┘ │ uploadedBy  │        ▼
                └─────────────┘ ┌─────────────┐
                                │    tags     │
                                ├─────────────┤
                                │ id (PK)     │
                                │ name        │
                                │ color       │
                                └─────────────┘
```

---

### ÉPICA 2: Backend - API

#### Tarefa 2.1: Configurar Elysia

**Prioridade**: Alta | **Estimativa**: 3h | **Dependências**: 1.4

**Descrição**:
Configurar o servidor Elysia com plugins essenciais.

**Subtarefas**:

- [ ] Instalar Elysia e plugins
- [ ] Configurar CORS
- [ ] Configurar JWT
- [ ] Criar estrutura de rotas
- [ ] Configurar middleware de erro
- [ ] Testar servidor básico

**Critérios de Aceitação**:

- Servidor inicia na porta 3000
- CORS funciona para requests do frontend
- JWT gera e verifica tokens
- Erros são tratados adequadamente

**Especificação Técnica**:

```typescript
// apps/web/src/index.ts
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
    })
  )
  // ... rotas
  .listen(3000)
```

---

#### Tarefa 2.2: Implementar Autenticação

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 2.1

**Descrição**:
Implementar sistema de autenticação completo com JWT.

**Subtarefas**:

- [ ] Criar rota de login
- [ ] Criar rota de logout
- [ ] Criar rota `/me`
- [ ] Implementar hash de senha (bcrypt)
- [ ] Criar middleware de autenticação
- [ ] Criar middleware de autorização por role
- [ ] Testar fluxo completo

**Critérios de Aceitação**:

- Login retorna token JWT válido
- `/me` retorna dados do usuário autenticado
- Senhas são hasheadas (não salvas em plaintext)
- Rotas protegidas retornam 401 sem token
- Roles funcionam (admin, designer, viewer)

**Especificação Técnica**:

```typescript
// apps/web/src/routes/auth.ts
import { Elysia, t } from 'elysia'
import { db } from '@design-hub/config'
import { users } from '@design-hub/config/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post(
    '/login',
    async ({ jwt, body }) => {
      const { email, password } = body

      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      })

      if (!user) {
        return { error: 'User not found' }
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return { error: 'Invalid password' }
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get('/me', async ({ jwt, headers }) => {
    const auth = headers.authorization
    if (!auth) return { error: 'Unauthorized' }

    const token = auth.replace('Bearer ', '')
    const payload = await jwt.verify(token)

    if (!payload) return { error: 'Invalid token' }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id as string),
    })

    if (!user) return { error: 'User not found' }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  })
```

---

#### Tarefa 2.3: Implementar CRUD de Users

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 2.2

**Descrição**:
Implementar endpoints REST para gerenciamento de usuários.

**Subtarefas**:

- [ ] GET `/api/users` - Listar todos
- [ ] GET `/api/users/:id` - Buscar por ID
- [ ] POST `/api/users` - Criar novo
- [ ] PUT `/api/users/:id` - Atualizar
- [ ] DELETE `/api/users/:id` - Deletar
- [ ] Validação de dados (Zod)
- [ ] Paginação

**Critérios de Aceitação**:

- Todos os endpoints funcionam
- Validação impede dados inválidos
- Delete é soft delete (marca isActive = false)
- Paginação retorna metadados

**Especificação Técnica**:

```typescript
// Response format
{
  data: User[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

---

#### Tarefa 2.4: Implementar CRUD de Projects

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 2.2

**Descrição**:
Implementar endpoints para gerenciamento de projetos.

**Subtarefas**:

- [ ] GET `/api/projects` - Listar todos
- [ ] GET `/api/projects/:id` - Buscar com cards
- [ ] POST `/api/projects` - Criar novo
- [ ] PUT `/api/projects/:id` - Atualizar
- [ ] DELETE `/api/projects/:id` - Deletar
- [ ] Contagem de cards por projeto

**Critérios de Aceitação**:

- Projetos podem ser criados e gerenciados
- Cards são contados corretamente
- Delete remove projeto e cards associados

---

#### Tarefa 2.5: Implementar CRUD de Cards

**Prioridade**: Alta | **Estimativa**: 8h | **Dependências**: 2.3, 2.4

**Descrição**:
Implementar endpoints para gerenciamento de cards (funcionalidade principal).

**Subtarefas**:

- [ ] GET `/api/cards` - Listar com filtros
- [ ] GET `/api/cards/:id` - Buscar com relacionamentos
- [ ] POST `/api/cards` - Criar novo
- [ ] PUT `/api/cards/:id` - Atualizar
- [ ] DELETE `/api/cards/:id` - Deletar
- [ ] PATCH `/api/cards/:id/status` - Mudar status
- [ ] PATCH `/api/cards/:id/assign` - Atribuir
- [ ] Filtros: status, projeto, responsável, categoria
- [ ] Ordenação: data, prioridade, título
- [ ] Busca por título/descrição

**Critérios de Aceitação**:

- Todos os endpoints funcionam
- Filtros combinam corretamente
- Atribuição inicia SLA automaticamente
- Mudança de status notifica interessados

**Especificação Técnica**:

```typescript
// Query parameters
GET /api/cards?
  status=in_progress
  &projectId=xxx
  &assigneeId=yyy
  &categoryId=zzz
  &priority=high
  &search=keyword
  &sortBy=createdAt
  &sortOrder=desc
  &page=1
  &limit=20

// Response
{
  data: Card[],
  pagination: {...},
  filters: {...}
}
```

---

#### Tarefa 2.6: Implementar Comments e Attachments

**Prioridade**: Média | **Estimativa**: 5h | **Dependências**: 2.5

**Descrição**:
Implementar sistema de comentários e anexos.

**Subtarefas**:

- [ ] GET `/api/cards/:id/comments`
- [ ] POST `/api/cards/:id/comments`
- [ ] DELETE `/api/comments/:id`
- [ ] Upload de arquivos (S3/R2)
- [ ] GET `/api/cards/:id/attachments`
- [ ] DELETE `/api/attachments/:id`
- [ ] Validação de tipos de arquivo

**Critérios de Aceitação**:

- Comentários são criados e listados
- Arquivos são uploadados com sucesso
- Tamanhos máximos são respeitados
- Tipos de arquivo são validados

---

#### Tarefa 2.7: Implementar Tags

**Prioridade**: Média | **Estimativa**: 3h | **Dependências**: 2.5

**Descrição**:
Implementar sistema de tags flexíveis.

**Subtarefas**:

- [ ] GET `/api/tags` - Listar todas
- [ ] POST `/api/tags` - Criar nova
- [ ] DELETE `/api/tags/:id` - Deletar
- [ ] POST `/api/cards/:id/tags` - Adicionar tag ao card
- [ ] DELETE `/api/cards/:id/tags/:tagId` - Remover tag

**Critérios de Aceitação**:

- Tags podem ser criadas e gerenciadas
- Cards podem ter múltiplas tags
- Tags são filtráveis

---

#### Tarefa 2.8: Implementar Notifications

**Prioridade**: Alta | **Estimativa**: 5h | **Dependências**: 2.5

**Descrição**:
Implementar sistema de notificações.

**Subtarefas**:

- [ ] GET `/api/notifications` - Listar do usuário
- [ ] PATCH `/api/notifications/:id/read` - Marcar como lida
- [ ] PATCH `/api/notifications/read-all` - Marcar todas como lidas
- [ ] GET `/api/notifications/unread-count` - Contagem não lidas
- [ ] Serviço de criação de notificações
- [ ] Notificações automáticas por eventos

**Critérios de Aceitação**:

- Notificações são criadas automaticamente
- Usuário vê suas notificações
- Contagem não lidas funciona
- Marcar como lida funciona

**Eventos que geram notificações**:

- Novo card criado
- Card atribuído
- Status alterado
- Comentário adicionado
- SLA warning (4h restantes)
- SLA overdue

---

#### Tarefa 2.9: Implementar SLA Service

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 2.8

**Descrição**:
Implementar sistema de SLA configurável.

**Subtarefas**:

- [ ] Criar serviço de SLA
- [ ] Configurar SLA por prioridade
- [ ] Implementar timer (iniciar, pausar, retomar)
- [ ] Criar verificações periódicas
- [ ] Enviar notificações de warning
- [ ] Enviar notificações de overdue
- [ ] Dashboard de SLA

**Critérios de Aceitação**:

- SLA inicia quando card é atribuído
- SLA pausa quando aguardando feedback
- SLA retoma quando trabalho continua
- Notificações são enviadas no momento correto

**Configuração de SLA**:

```typescript
const SLA_CONFIG = {
  high: 24, // 24 horas
  medium: 48, // 48 horas
  low: 72, // 72 horas
}
```

---

#### Tarefa 2.10: Implementar Google Forms Webhook

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 2.5, 2.8

**Descrição**:
Implementar webhook para receber formulários do Google Forms.

**Subtarefas**:

- [ ] Criar endpoint POST `/api/webhook/google-forms`
- [ ] Validar assinatura do webhook
- [ ] Mapear campos do formulário
- [ ] Criar card automaticamente
- [ ] Notificar equipe
- [ ] Log de recebimento

**Critérios de Aceitação**:

- Webhook recebe dados do Google Forms
- Card é criado automaticamente
- Equipe é notificada
- Dados são validados

**Mapeamento de Campos**:

```typescript
// Google Form → Card
{
  "Nome": "requesterName",
  "Email": "requesterEmail",
  "Título": "title",
  "Descrição": "description",
  "Categoria": "category",
  "Prioridade": "priority",
  "Prazo": "dueDate"
}
```

---

#### Tarefa 2.11: Implementar Stripe Integration

**Prioridade**: Média | **Estimativa**: 6h | **Dependências**: 2.2

**Descrição**:
Implementar integração com Stripe para pagamentos.

**Subtarefas**:

- [ ] Configurar Stripe SDK
- [ ] Criar planos no Stripe
- [ ] Implementar checkout session
- [ ] Implementar customer portal
- [ ] Criar webhook handler
- [ ] Gerenciar assinaturas
- [ ] Validar limites por plano

**Critérios de Aceitação**:

- Checkout funciona corretamente
- Webhook recebe eventos
- Assinaturas são gerenciadas
- Limites são validados

**Planos**:

```typescript
const PLANS = {
  starter: {
    name: 'Starter',
    price: 9700, // $97.00
    limits: {
      users: 1,
      cards: 50,
      projects: 1,
    },
  },
  pro: {
    name: 'Pro',
    price: 19700, // $197.00
    limits: {
      users: 5,
      cards: 200,
      projects: 10,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 49700, // $497.00
    limits: {
      users: Infinity,
      cards: Infinity,
      projects: Infinity,
    },
  },
}
```

---

### ÉPICA 3: Frontend

#### Tarefa 3.1: Configurar Frontend

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 1.2

**Descrição**:
Configurar o stack de frontend com TanStack e Tailwind.

**Subtarefas**:

- [ ] Instalar TanStack Router
- [ ] Instalar TanStack Query
- [ ] Configurar Tailwind CSS
- [ ] Configurar PostCSS
- [ ] Criar estrutura de pastas
- [ ] Configurar path aliases

**Critérios de Aceitação**:

- Roteamento funciona
- Query funciona com mock data
- Tailwind aplica estilos
- Hot reload funciona

---

#### Tarefa 3.2: Criar Layout Principal

**Prioridade**: Alta | **Estimativa**: 5h | **Dependências**: 3.1

**Descrição**:
Criar o layout principal da aplicação.

**Subtarefas**:

- [ ] Criar componente Layout
- [ ] Criar Sidebar
- [ ] Criar Header
- [ ] Criar área de conteúdo
- [ ] Implementar navegação
- [ ] Responsividade básica

**Critérios de Aceitação**:

- Layout renderiza corretamente
- Navegação funciona
- Sidebar é responsiva
- Header mostra usuário

**Especificação Técnica**:

```tsx
// apps/web/src/components/Layout.tsx
export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-white">
        <nav>{/* Links */}</nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
```

---

#### Tarefa 3.3: Criar Componentes UI

**Prioridade**: Alta | **Estimativa**: 8h | **Dependências**: 3.1

**Descrição**:
Criar biblioteca de componentes UI reutilizáveis.

**Subtarefas**:

- [ ] Button (variantes: primary, secondary, ghost)
- [ ] Input (com label, error)
- [ ] Select
- [ ] Badge
- [ ] Avatar
- [ ] Modal
- [ ] Dropdown
- [ ] Toast
- [ ] Tooltip
- [ ] Card
- [ ] Table

**Critérios de Aceitação**:

- Todos os componentes funcionam
- Componentes são acessíveis
- Variantes funcionam
- Tema escuro funciona (futuro)

**Especificação Técnica**:

```tsx
// packages/ui/src/components/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  )
}
```

---

#### Tarefa 3.4: Criar Dashboard

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 3.2, 3.3

**Descrição**:
Criar página de dashboard com métricas e resumo.

**Subtarefas**:

- [ ] Criar cards de estatísticas
- [ ] Listar cards atribuídos
- [ ] Listar notificações recentes
- [ ] Mostrar SLA warning
- [ ] Gráficos simples (futuro)

**Critérios de Aceitação**:

- Dashboard mostra métricas corretas
- Cards atribuídos aparecem
- Notificações recentes aparecem
- Dados são atualizados automaticamente

**Layout**:

```
┌─────────────────────────────────────────────────────┐
│  Dashboard                                           │
├──────────┬──────────┬──────────┬─────────────────────┤
│  Total   │   New    │   In     │     Urgent          │
│  Cards   │          │ Progress │                     │
│   42     │    8     │    12    │        3            │
├──────────┴──────────┴──────────┴─────────────────────┤
│  My Cards                          │  Notifications   │
│  ┌─────────────────────────────┐   │  ┌────────────┐  │
│  │ Card 1 - High Priority     │   │  │ New card   │  │
│  │ Card 2 - Medium Priority   │   │  │ SLA warning│  │
│  │ Card 3 - Low Priority      │   │  │ Comment    │  │
│  └─────────────────────────────┘   │  └────────────┘  │
└─────────────────────────────────────┴─────────────────┘
```

---

#### Tarefa 3.5: Criar Kanban Board

**Prioridade**: Alta | **Estimativa**: 10h | **Dependências**: 3.3

**Descrição**:
Criar board Kanban com drag and drop.

**Subtarefas**:

- [ ] Criar componente KanbanBoard
- [ ] Criar componente KanbanColumn
- [ ] Criar componente KanbanCard
- [ ] Implementar drag and drop
- [ ] Implementar reordering
- [ ] Filtros no board
- [ ] Contadores por coluna
- [ ] Otimização de performance

**Critérios de Aceitação**:

- Cards podem ser arrastados entre colunas
- Cards podem ser reordenados dentro da coluna
- Mudanças são salvas automaticamente
- UI é responsiva
- Performance é boa (>60fps)

**Especificação Técnica**:

```tsx
// Drag and Drop com @dnd-kit
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export const KanbanBoard: React.FC = () => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Mover card
      moveCard(active.id as string, over.id as string)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </DndContext>
  )
}
```

---

#### Tarefa 3.6: Criar Lista de Cards

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 3.3

**Descrição**:
Criar visualização em tabela de todos os cards.

**Subtarefas**:

- [ ] Criar componente Table
- [ ] Implementar busca
- [ ] Implementar filtros
- [ ] Implementar ordenação
- [ ] Implementar paginação
- [ ] Ações em massa (futuro)

**Critérios de Aceitação**:

- Tabela mostra todos os cards
- Busca funciona em tempo real
- Filtros combinam corretamente
- Ordenação funciona
- Paginação funciona

---

#### Tarefa 3.7: Criar Detalhe do Card

**Prioridade**: Alta | **Estimativa**: 8h | **Dependências**: 3.3, 3.6

**Descrição**:
Criar página de detalhe do card.

**Subtarefas**:

- [ ] Mostrar informações do card
- [ ] Formulário de edição
- [ ] Seção de comentários
- [ ] Seção de anexos
- [ ] Atribuição
- [ ] Mudança de status
- [ ] SLA indicator
- [ ] Histórico de mudanças

**Critérios de Aceitação**:

- Todas as informações são exibidas
- Edição funciona
- Comentários podem ser adicionados
- Anexos podem ser uploadados
- Atribuição funciona
- Status pode ser mudado

**Layout**:

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Cards                                    │
├─────────────────────────────────────────────────────┤
│  Card Title                              │ Status   │
│  Description...                         │ [Select] │
│                                          ├──────────┤
│                                          │ Priority │
│                                          │ [High]   │
│                                          ├──────────┤
│                                          │ Assignee │
│                                          │ [Select] │
│                                          ├──────────┤
│  Comments                                │ SLA      │
│  ┌─────────────────────────────────────┐ │ 18h left │
│  │ User 1: Comment here...            │ ├──────────┤
│  │ User 2: Reply here...              │ │ Due Date │
│  └─────────────────────────────────────┘ │ 2024-01  │
│  [Add comment...]                        └──────────┘
└─────────────────────────────────────────────────────┘
```

---

#### Tarefa 3.8: Criar Página de Projetos

**Prioridade**: Média | **Estimativa**: 5h | **Dependências**: 3.3

**Descrição**:
Criar página de gerenciamento de projetos.

**Subtarefas**:

- [ ] Lista de projetos
- [ ] Criar projeto
- [ ] Editar projeto
- [ ] Deletar projeto
- [ ] Cards por projeto

**Critérios de Aceitação**:

- Projetos podem ser criados
- Projetos podem ser editados
- Projetos podem ser deletados
- Cards são filtrados por projeto

---

#### Tarefa 3.9: Criar Página de Settings

**Prioridade**: Média | **Estimativa**: 6h | **Dependências**: 3.3

**Descrição**:
Criar página de configurações.

**Subtarefas**:

- [ ] Perfil do usuário
- [ ] Gerenciar equipe
- [ ] Gerenciar categorias
- [ ] Gerenciar tags
- [ ] Configurar SLA
- [ ] Billing (Stripe)

**Critérios de Aceitação**:

- Perfil pode ser editado
- Equipe pode ser gerenciada
- Categorias podem ser criadas
- Tags podem ser criadas
- SLA pode ser configurado
- Billing mostra plano atual

---

### ÉPICA 4: Testes

#### Tarefa 4.1: Configurar Testes

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 1.1

**Descrição**:
Configurar ambiente de testes.

**Subtarefas**:

- [ ] Instalar Vitest
- [ ] Configurar testes unitários
- [ ] Configurar testes de integração
- [ ] Criar fixtures
- [ ] Configurar coverage

**Critérios de Aceitação**:

- Testes executam com `bun test`
- Coverage é gerado
- Fixtures funcionam

---

#### Tarefa 4.2: Testes de Backend

**Prioridade**: Alta | **Estimativa**: 10h | **Dependências**: 4.1, 2.x

**Descrição**:
Escrever testes para toda a API.

**Subtarefas**:

- [ ] Testes de autenticação
- [ ] Testes de users
- [ ] Testes de projects
- [ ] Testes de cards
- [ ] Testes de comments
- [ ] Testes de tags
- [ ] Testes de notifications
- [ ] Testes de SLA
- [ ] Testes de webhooks

**Critérios de Aceitação**:

- Todas as rotas têm testes
- Testes passam
- Coverage > 80%

---

#### Tarefa 4.3: Testes de Frontend

**Prioridade**: Média | **Estimativa**: 8h | **Dependências**: 4.1, 3.x

**Descrição**:
Escrever testes para componentes.

**Subtarefas**:

- [ ] Testes de componentes UI
- [ ] Testes de páginas
- [ ] Testes de hooks
- [ ] Testes de integração

**Critérios de Aceitação**:

- Componentes têm testes
- Testes passam
- Coverage > 70%

---

### ÉPICA 5: Deploy

#### Tarefa 5.1: Configurar CI/CD

**Prioridade**: Alta | **Estimativa**: 4h | **Dependências**: 4.x

**Descrição**:
Configurar pipeline de CI/CD.

**Subtarefas**:

- [ ] Criar GitHub Actions workflow
- [ ] Rodar testes no PR
- [ ] Rodar lint no PR
- [ ] Deploy automático em main
- [ ] Notificações no Slack (futuro)

**Critérios de Aceitação**:

- PRs são testados automaticamente
- Deploy acontece em main
- Falhas são reportadas

**Especificação Técnica**:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: bun run lint
```

---

#### Tarefa 5.2: Deploy em Produção

**Prioridade**: Alta | **Estimativa**: 6h | **Dependências**: 5.1

**Descrição**:
Fazer deploy do sistema em produção.

**Subtarefas**:

- [ ] Configurar Railway
- [ ] Configurar Vercel
- [ ] Configurar variáveis de ambiente
- [ ] Configurar domínios
- [ ] Testar em produção
- [ ] Monitorar erros

**Critérios de Aceitação**:

- Sistema está acessível
- Todas as funcionalidades funcionam
- Performance é aceitável
- Erros são monitorados

---

## Matriz de Dependências

```
1.1 → 1.2 → 1.3 → 1.4
                      ↓
                    2.1 → 2.2 → 2.3 → 2.5 → 2.6
                    ↓         ↓     ↓     ↓
                    2.4      2.7   2.8   2.9
                               ↓     ↓
                              2.10  2.11
                                ↓
1.1 → 3.1 → 3.2 → 3.4
    → 3.3 → 3.5
          → 3.6 → 3.7
          → 3.8
          → 3.9

1.1 → 4.1 → 4.2
           → 4.3

4.x → 5.1 → 5.2
```

---

## Estimativas de Tempo

| Épica             | Estimativa | Dependências |
| ----------------- | ---------- | ------------ |
| 1. Infraestrutura | 15h        | -            |
| 2. Backend        | 55h        | Épica 1      |
| 3. Frontend       | 58h        | Épica 1      |
| 4. Testes         | 22h        | Épicas 2, 3  |
| 5. Deploy         | 10h        | Épica 4      |
| **Total**         | **160h**   | -            |

**Considerando**:

- 8h/dia de desenvolvimento
- 20 dias úteis/mês
- **Total estimado**: ~20 dias úteis (4 semanas)

---

## Marcos (Milestones)

### Milestone 1: MVP (Semana 2)

- [x] Infraestrutura configurada
- [x] Schema do banco criado
- [x] API básica funcionando
- [x] Autenticação funcionando

### Milestone 2: Core Features (Semana 4)

- [x] CRUD completo
- [x] Kanban board
- [x] Comentários
- [x] Notificações

### Milestone 3: Advanced Features (Semana 6)

- [x] SLA configurável
- [x] Drag and drop
- [x] Filtros avançados
- [x] Stripe integration

### Milestone 4: Production Ready (Semana 8)

- [x] Testes completos
- [x] CI/CD configurado
- [x] Deploy em produção
- [x] Monitoramento

---

## Riscos e Mitigações

| Risco                   | Probabilidade | Impacto | Mitigação                |
| ----------------------- | ------------- | ------- | ------------------------ |
| SLA complexo            | Média         | Alto    | Começar simples, iterar  |
| Drag and drop lento     | Baixa         | Médio   | Usar @dnd-kit, otimizar  |
| Integração Google Forms | Baixa         | Alto    | Webhook simples primeiro |
| Stripe complexo         | Baixa         | Médio   | Usar templates prontos   |
| Performance ruim        | Média         | Alto    | Profilear, otimizar cedo |
| Bugs em produção        | Alta          | Alto    | Testes, monitoramento    |

---

## Definição de Pronto (Definition of Done)

Uma tarefa está pronta quando:

1. **Código**: Funcionalidade implementada
2. **Testes**: Testes escritos e passando
3. **Documentação**: Documentada se necessário
4. **Revisão**: Code review aprovado
5. **Lint**: Sem erros de lint
6. **Build**: Build passa
7. **Deploy**: Funciona em staging

---

## Ferramentas Recomendadas

### Desenvolvimento

- **IDE**: VS Code
- **Extensions**: ESLint, Prettier, Tailwind IntelliSense
- **Terminal**: Warp ou iTerm2

### Design

- **Figma**: Para protótipos
- **Excalidraw**: Para wireframes

### Gestão

- **GitHub Issues**: Para tracking
- **GitHub Projects**: Para Kanban
- **Notion**: Para documentação

---

## Próximos Passos

1. **Iniciar Tarefa 1.1**: Configurar ambiente
2. **Criar repo no GitHub**
3. **Configurar branch protection**
4. **Começar desenvolvimento**

---

_Documento atualizado em: 2024_
_Próxima revisão: Após Milestone 1_
