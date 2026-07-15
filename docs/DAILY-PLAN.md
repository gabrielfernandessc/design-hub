# Plano de Trabalho Diário - Design Hub

## Semana 1: Infraestrutura

### Dia 1 (Segunda)

**Foco**: Setup inicial

- [x] Instalar Bun
- [x] Criar estrutura do monorepo
- [x] Configurar Turborepo
- [x] Criar `.gitignore`
- [x] Criar `package.json` raiz

**Entregável**: Monorepo funcional

---

### Dia 2 (Terça)

**Foco**: Database

- [ ] Criar conta no Railway
- [ ] Criar PostgreSQL
- [ ] Configurar `.env`
- [ ] Instalar Drizzle ORM
- [ ] Criar `drizzle.config.ts`

**Entregável**: Database configurado

---

### Dia 3 (Quarta)

**Foco**: Schema

- [ ] Criar tabela users
- [ ] Criar tabela projects
- [ ] Criar tabela categories
- [ ] Criar tabela cards
- [ ] Criar tabela tags

**Entregável**: Schema parcial

---

### Dia 4 (Quinta)

**Foco**: Schema (continuação)

- [ ] Criar tabela card_tags
- [ ] Criar tabela comments
- [ ] Criar tabela attachments
- [ ] Criar tabela notifications
- [ ] Criar migrations

**Entregável**: Schema completo

---

### Dia 5 (Sexta)

**Foco**: Validação

- [ ] Testar migrations
- [ ] Criar seed data
- [ ] Testar Drizzle Studio
- [ ] Documentar schema
- [ ] Revisão semanal

**Entregável**: Infraestrutura pronta

---

## Semana 2: Backend

### Dia 6 (Segunda)

**Foco**: Setup Elysia

- [ ] Instalar Elysia
- [ ] Configurar CORS
- [ ] Configurar JWT
- [ ] Criar estrutura de rotas
- [ ] Testar servidor

**Entregável**: Servidor funcional

---

### Dia 7 (Terça)

**Foco**: Auth

- [ ] Criar rota login
- [ ] Criar rota me
- [ ] Implementar bcrypt
- [ ] Criar middleware auth
- [ ] Testar fluxo

**Entregável**: Autenticação funcionando

---

### Dia 8 (Quarta)

**Foco**: Users API

- [ ] GET /users
- [ ] GET /users/:id
- [ ] POST /users
- [ ] PUT /users/:id
- [ ] DELETE /users/:id

**Entregável**: Users CRUD completo

---

### Dia 9 (Quinta)

**Foco**: Projects API

- [ ] GET /projects
- [ ] GET /projects/:id
- [ ] POST /projects
- [ ] PUT /projects/:id
- [ ] DELETE /projects/:id

**Entregável**: Projects CRUD completo

---

### Dia 10 (Sexta)

**Foco**: Cards API (início)

- [ ] GET /cards (listagem)
- [ ] GET /cards/:id (detalhe)
- [ ] POST /cards (criação)
- [ ] Testar filtros básicos
- [ ] Revisão semanal

**Entregável**: Cards API parcial

---

## Semana 3: Backend (continuação) + Frontend Início

### Dia 11 (Segunda)

**Foco**: Cards API (continuação)

- [ ] PUT /cards/:id
- [ ] DELETE /cards/:id
- [ ] PATCH /cards/:id/status
- [ ] PATCH /cards/:id/assign
- [ ] Filtros avançados

**Entregável**: Cards API completa

---

### Dia 12 (Terça)

**Foco**: Comments e Tags

- [ ] Comments CRUD
- [ ] Tags CRUD
- [ ] Card-Tags relation
- [ ] Testar relacionamentos
- [ ] Documentar endpoints

**Entregável**: Comments e Tags funcionando

---

### Dia 13 (Quarta)

**Foco**: Notifications

- [ ] GET /notifications
- [ ] PATCH /notifications/:id/read
- [ ] Serviço de notificações
- [ ] Notificações automáticas
- [ ] Testar eventos

**Entregável**: Sistema de notificações

---

### Dia 14 (Quinta)

**Foco**: Frontend Setup

- [ ] Instalar TanStack Router
- [ ] Instalar TanStack Query
- [ ] Configurar Tailwind
- [ ] Criar estrutura de pastas
- [ ] Testar roteamento

**Entregável**: Frontend configurado

---

### Dia 15 (Sexta)

**Foco**: Layout

- [ ] Criar Layout component
- [ ] Criar Sidebar
- [ ] Criar Header
- [ ] Criar rotas básicas
- [ ] Revisão semanal

**Entregável**: Layout funcional

---

## Semana 4: Frontend

### Dia 16 (Segunda)

**Foco**: UI Components

- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Badge
- [ ] Avatar

**Entregável**: Componentes básicos

---

### Dia 17 (Terça)

**Foco**: UI Components (continuação)

- [ ] Modal
- [ ] Dropdown
- [ ] Toast
- [ ] Tooltip
- [ ] Card

**Entregável**: Componentes avançados

---

### Dia 18 (Quarta)

**Foco**: Dashboard

- [ ] Cards de estatísticas
- [ ] Lista de cards atribuídos
- [ ] Lista de notificações
- [ ] Integrar com API
- [ ] Estilizar

**Entregável**: Dashboard funcional

---

### Dia 19 (Quinta)

**Foco**: Kanban Board

- [ ] Criar KanbanBoard
- [ ] Criar KanbanColumn
- [ ] Criar KanbanCard
- [ ] Integrar com API
- [ ] Estilizar

**Entregável**: Kanban básico

---

### Dia 20 (Sexta)

**Foco**: Drag and Drop

- [ ] Instalar @dnd-kit
- [ ] Implementar drag
- [ ] Implementar drop
- [ ] Salvar mudanças
- [ ] Revisão semanal

**Entregável**: Drag and drop funcionando

---

## Semana 5: Frontend (continuação)

### Dia 21 (Segunda)

**Foco**: Cards List

- [ ] Criar Table component
- [ ] Listar cards
- [ ] Implementar busca
- [ ] Implementar filtros
- [ ] Implementar paginação

**Entregável**: Lista de cards funcional

---

### Dia 22 (Terça)

**Foco**: Card Detail

- [ ] Página de detalhe
- [ ] Formulário de edição
- [ ] Mudança de status
- [ ] Atribuição
- [ ] SLA indicator

**Entregável**: Detalhe do card funcional

---

### Dia 23 (Quarta)

**Foco**: Comments

- [ ] Lista de comentários
- [ ] Formulário de comentário
- [ ] Integração com API
- [ ] Estilizar
- [ ] Testar

**Entregável**: Comentários funcionando

---

### Dia 24 (Quinta)

**Foco**: Projects e Settings

- [ ] Página de projetos
- [ ] Criar/editar projeto
- [ ] Página de settings
- [ ] Perfil do usuário
- [ ] Gerenciar equipe

**Entregável**: Projects e Settings

---

### Dia 25 (Sexta)

**Foco**: SLA e Notifications UI

- [ ] Dashboard de SLA
- [ ] Configuração de SLA
- [ ] Página de notificações
- [ ] Badges de não lidas
- [ ] Revisão semanal

**Entregável**: SLA e Notifications UI

---

## Semana 6: Features Especiais

### Dia 26 (Segunda)

**Foco**: SLA Service

- [ ] Implementar timer
- [ ] Implementar pausa
- [ ] Implementar resume
- [ ] Notificações de warning
- [ ] Notificações de overdue

**Entregável**: SLA completo

---

### Dia 27 (Terça)

**Foco**: Google Forms Webhook

- [ ] Criar endpoint
- [ ] Validar assinatura
- [ ] Mapear campos
- [ ] Criar card automaticamente
- [ ] Testar com formulário real

**Entregável**: Webhook funcionando

---

### Dia 28 (Quarta)

**Foco**: Stripe Setup

- [ ] Criar conta no Stripe
- [ ] Criar produtos
- [ ] Criar preços
- [ ] Configurar webhooks
- [ ] Testar checkout

**Entregável**: Stripe configurado

---

### Dia 29 (Quinta)

**Foco**: Stripe Integration

- [ ] Checkout session
- [ ] Customer portal
- [ ] Webhook handler
- [ ] Gerenciar assinaturas
- [ ] Validar limites

**Entregável**: Stripe completo

---

### Dia 30 (Sexta)

**Foco**: Billing UI

- [ ] Página de billing
- [ ] Mostrar plano atual
- [ ] Botão de upgrade
- [ ] Portal do cliente
- [ ] Revisão semanal

**Entregável**: Billing funcional

---

## Semana 7: Testes

### Dia 31 (Segunda)

**Foco**: Setup de Testes

- [ ] Instalar Vitest
- [ ] Configurar testes
- [ ] Criar fixtures
- [ ] Testar setup
- [ ] Documentar

**Entregável**: Ambiente de testes

---

### Dia 32 (Terça)

**Foco**: Testes Backend (Auth)

- [ ] Testes de login
- [ ] Testes de me
- [ ] Testes de middleware
- [ ] Testes de roles
- [ ] Coverage

**Entregável**: Testes de auth

---

### Dia 33 (Quarta)

**Foco**: Testes Backend (CRUD)

- [ ] Testes de users
- [ ] Testes de projects
- [ ] Testes de cards
- [ ] Testes de comments
- [ ] Coverage

**Entregável**: Testes de CRUD

---

### Dia 34 (Quinta)

**Foco**: Testes Backend (Services)

- [ ] Testes de SLA
- [ ] Testes de notifications
- [ ] Testes de webhooks
- [ ] Testes de stripe
- [ ] Coverage

**Entregável**: Testes de services

---

### Dia 35 (Sexta)

**Foco**: Testes Frontend

- [ ] Testes de componentes
- [ ] Testes de páginas
- [ ] Testes de hooks
- [ ] Coverage
- [ ] Revisão semanal

**Entregável**: Testes de frontend

---

## Semana 8: Deploy

### Dia 36 (Segunda)

**Foco**: CI/CD

- [ ] Criar GitHub Actions
- [ ] Configurar testes no PR
- [ ] Configurar lint no PR
- [ ] Configurar deploy automático
- [ ] Testar pipeline

**Entregável**: CI/CD funcionando

---

### Dia 37 (Terça)

**Foco**: Deploy Backend

- [ ] Configurar Railway
- [ ] Configurar variáveis
- [ ] Deploy
- [ ] Testar em produção
- [ ] Monitorar erros

**Entregável**: Backend em produção

---

### Dia 38 (Quarta)

**Foco**: Deploy Frontend

- [ ] Configurar Vercel
- [ ] Configurar variáveis
- [ ] Deploy
- [ ] Testar em produção
- [ ] Configurar domínio

**Entregável**: Frontend em produção

---

### Dia 39 (Quinta)

**Foco**: Integração

- [ ] Testar fluxo completo
- [ ] Testar com Google Forms
- [ ] Testar com Stripe
- [ ] Corrigir bugs
- [ ] Otimizar performance

**Entregável**: Sistema integrado

---

### Dia 40 (Sexta)

**Foco**: Lançamento

- [ ] Documentação final
- [ ] Treinamento da equipe
- [ ] Monitoramento
- [ ] Feedback inicial
- [ ] Planejamento pós-lançamento

**Entregável**: Sistema lançado

---

## Resumo Semanal

| Semana    | Foco                    | Horas    | Entregável            |
| --------- | ----------------------- | -------- | --------------------- |
| 1         | Infraestrutura          | 40h      | Setup completo        |
| 2         | Backend I               | 40h      | API básica            |
| 3         | Backend II + Frontend I | 40h      | API completa + Layout |
| 4         | Frontend II             | 40h      | UI completa           |
| 5         | Frontend III            | 40h      | Features completas    |
| 6         | Features Especiais      | 40h      | SLA, Stripe, Webhooks |
| 7         | Testes                  | 40h      | Testes completos      |
| 8         | Deploy                  | 40h      | Sistema em produção   |
| **Total** |                         | **320h** | **Sistema completo**  |

---

## Dicas de Produtividade

1. **Comece pelo mais difícil**: Tarefas complexas primeiro
2. **Itere rápido**: MVP antes de perfection
3. **Teste cedo**: Não espere o final
4. **Documente**: Futuro eu agradece
5. **Pausas**: Pomodoro (25min work, 5min break)

---

## Checklist Diário

- [ ] Revisar tarefas do dia
- [ ] Atualizar status no board
- [ ] Comitar código
- [ ] Rodar testes
- [ ] Documentar aprendizados
- [ ] Planejar próximo dia

---

_Última atualização: 2024_
