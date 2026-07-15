# Regras de Negócio - Design Hub

## Visão Geral

O Design Hub é um portal de chamados e solicitações de design que recebe pedidos via Google Forms e os gerencia como tasks para a equipe criativa.

## Fluxo Principal

### 1. Entrada de Chamados

- Usuário preenche formulário no Google Forms
- Formulário coleta:
  - Nome do solicitante
  - Email de contato
  - Tipo de demanda (branding, UI/UX, marketing, etc.)
  - Descrição detalhada
  - Referências visuais (se houver)
  - Prazo desejado
  - Prioridade

### 2. Criação do Card

- Sistema recebe dados do formulário
- Cria card/task automaticamente
- Card recebe:
  - ID único
  - Status: "Novo"
  - Data de criação
  - SLA baseado no tipo
  - Prioridade

### 3. Distribuição

- Card fica disponível para toda a equipe
- Pode ser visualizado no Kanban
- Equipe pode filtrar por:
  - Tipo de demanda
  - Prioridade
  - Status
  - SLA

### 4. Atribuição

- Designer abre o card
- Visualiza todas as informações
- Pode atribuir a si mesmo
- Card muda para status "Em Progresso"
- SLA começa a contar

### 5. Execução

- Designer trabalha na demanda
- Pode adicionar comentários
- Pode atualizar status
- Pode solicitar esclarecimentos

### 6. Conclusão

- Designer marca como concluído
- Card vai para status "Concluído"
- Solicitante é notificado
- Métricas são atualizadas

## Tipos de Demanda

### Branding

- Identidade visual
- Logo
- Paleta de cores
- Tipografia
- Manual de marca

### UI/UX

- Interface de usuário
- Experiência do usuário
- Wireframes
- Protótipos
- Design system

### Marketing

- Peças publicitárias
- Materiais para redes sociais
- Banners
- Landing pages
- Email marketing

### Outros

- Apresentações
- Documentos
- Relatórios
- Materiais internos

## SLA Configurável

### Prioridade Alta

- **Prazo**: 24 horas
- **Notificação**: A cada 4 horas
- **Escalação**: Automática após 12 horas

### Prioridade Média

- **Prazo**: 48 horas
- **Notificação**: A cada 8 horas
- **Escalação**: Automática após 24 horas

### Prioridade Baixa

- **Prazo**: 72 horas
- **Notificação**: A cada 12 horas
- **Escalação**: Automática após 48 horas

## Status dos Cards

### Novo

- Card recém-criado
- Aguardando atribuição
- SLA não iniciado

### Em Progresso

- Card atribuído a um designer
- Trabalho em andamento
- SLA em contagem

### Aguardando Feedback

- Designer solicitou esclarecimento
- Aguardando resposta do solicitante
- SLA pausado

### Concluído

- Trabalho finalizado
- Solicitante notificado
- Métricas atualizadas

### Cancelado

- Demanda cancelada
- Motivo registrado
- Métricas atualizadas

## Notificações

### Para Designers

- Novo card disponível
- Card atribuído
- SLA próximo do vencimento
- SLA vencido
- Comentário no card

### Para Solicitantes

- Card criado
- Card em progresso
- Solicitação de feedback
- Card concluído
- Card cancelado

### Para Administradores

- Cards sem atribuição
- SLA vencidos
- Métricas de produtividade
- Relatórios semanais

## Métricas

### Por Designer

- Cards concluídos
- Tempo médio de conclusão
- SLA cumprido (%)
- Cards por tipo

### Por Tipo de Demanda

- Volume de demandas
- Tempo médio de resolução
- SLA cumprido (%)
- Satisfação do solicitante

### Geral

- Total de cards
- Cards ativos
- Tempo médio de resolução
- SLA geral cumprido (%)
- Taxa de cancelamento

## Regras de Negócio Específicas

### Atribuição

- Um card só pode ser atribuído a um designer por vez
- Designer pode desatribuir card (volta para "Novo")
- Admin pode reatribuir cards

### SLA

- SLA começa quando card é atribuído
- SLA pausa quando card vai para "Aguardando Feedback"
- SLA retoma quando feedback é recebido
- SLA é recalculado se prioridade mudar

### Comentários

- Qualquer pessoa pode comentar
- Comentários são públicos
- Comentários são salvos com timestamp

### Anexos

- Designers podem adicionar anexos
- Anexos são versionados
- Anexos são mantidos após conclusão

## Integrações

### Google Forms

- Webhook para receber submissões
- Mapeamento de campos
- Validação de dados

### Email

- Notificações por email
- Templates configuráveis
- Frequência configurável

### Slack (futuro)

- Notificações em canal
- Comandos rápidos
- Status de cards
