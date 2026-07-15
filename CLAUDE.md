# Design Hub - Instruções para o Agente

## Visão Geral

O Design Hub é um SaaS portal de chamados e solicitações de design. Recebe pedidos via Google Forms e os gerencia como tasks para a equipe criativa.

## Stack Tecnológica

- **Runtime**: Bun
- **Backend**: Elysia
- **Frontend**: TanStack (Router + Query) com SSR
- **Estilo**: Tailwind CSS
- **Pagamentos**: Stripe
- **Monorepo**: Turborepo
- **API Tipada**: Eden Treaty

## Skills Disponíveis

### Skills de Produto (USE AUTOMATICAMENTE)

1. **viral-product-principles**
   - USE quando: Construindo/revisando landing pages, pricing, copy, conversão
   - Localização: `.mimocode/skills/viral-product-principles/SKILL.md`
   - Conteúdo: 32 princípios para produtos virais

2. **revenue-centric-design**
   - USE quando: Projetando interfaces de produto, decisões de monetização
   - Localização: `.mimocode/skills/revenue-centric-design/SKILL.md`
   - Conteúdo: 101 princípios de design centrado em receita

### Skills de Design (USE AUTOMATICAMENTE)

3. **emil-design-eng**
   - USE quando: Implementando/revisando animações, motion design
   - Localização: `.mimocode/skills/emil-design-eng/SKILL.md`
   - Conteúdo: Princípios de animação, easing, duração, performance

### Skills de Engenharia (USE AUTOMATICAMENTE)

4. **grill-me**
   - USE quando: Antes de implementar features, questionando decisões
   - Localização: `.mimocode/skills/grill-me/SKILL.md`
   - Conteúdo: Entrevista relaxante para resolver decisões

## Regras de Uso das Skills

### Sempre que:

- **Criando landing page** → Use viral-product-principles + revenue-centric-design
- **Criando pricing** → Use viral-product-principles (Popcorn Pricing)
- **Escrevendo copy** → Use viral-product-principles + revenue-centric-design
- **Implementando animações** → Use emil-design-eng
- **Revisando animações** → Use review-animations (parte de emil-design-eng)
- **Planejando feature** → Use grill-me antes de começar
- **Definindo arquitetura** → Use grill-me + revenue-centric-design

### Fluxo de Trabalho

1. **Planejamento**: grill-me → revenue-centric-design
2. **Design**: viral-product-principles + emil-design-eng
3. **Implementação**: emil-design-eng (para animações)
4. **Revisão**: review-animations + viral-product-principles

## Estrutura do Projeto

```
design-hub/
├── apps/
│   ├── web/          # Portal de chamados principal
│   └── admin/        # Painel administrativo
├── packages/
│   ├── ui/           # Componentes compartilhados
│   ├── config/       # Configurações
│   └── api-client/   # Cliente API tipado
├── docs/             # Documentação
└── .mimocode/
    └── skills/       # Skills do agente
```

## Regras de Negócio

### Fluxo Principal

1. Google Forms → Card criado automaticamente
2. Card disponível para toda a equipe
3. Designer atribui a si mesmo
4. Trabalho realizado com SLA
5. Conclusão e notificação

### SLA Configurável

- Alta: 24h
- Média: 48h
- Baixa: 72h

### Status dos Cards

- Novo → Em Progresso → Concluído
- Novo → Aguardando Feedback → Em Progresso
- Qualquer → Cancelado

## Documentação

- `docs/ARCHITECTURE.md` - Arquitetura do sistema
- `docs/BUSINESS-RULES.md` - Regras de negócio detalhadas
- `docs/SKILLS-REFERENCE.md` - Referência completa das skills

## Comandos Úteis

```bash
# Instalar dependências
bun install

# Rodar em desenvolvimento
bun run dev

# Rodar app web
bun run --filter=web dev

# Rodar app admin
bun run --filter=admin dev
```

## Observações Importantes

1. **NÃO comece a programar ainda** - Estamos em fase de setup
2. **USE as skills automaticamente** - Elas são ferramentas, não documentação
3. **Siga os princípios** - viral-product-principles e revenue-centric-design são-leis
4. **Questione decisões** - Use grill-me antes de implementar
5. **Animações importam** - Use emil-design-eng para motion design
