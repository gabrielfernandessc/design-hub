# Design Hub

> Portal de chamados e solicitações de design para equipes criativas.

## Visão Geral

O Design Hub é um SaaS que recebe pedidos de arte via formulário do Google Forms e os transforma em tasks/cards acessíveis pela equipe toda. Funciona como um portal de chamados e solicitações onde a equipe pode atribuir, gerenciar e acompanhar pedidos de design com SLA configurável.

## Stack Tecnológica

- **Runtime**: Bun
- **Backend**: Elysia (framework web para Bun)
- **Frontend**: TanStack com SSR (React Query + Router)
- **Estilização**: Tailwind CSS
- **Pagamentos**: Stripe
- **Monorepo**: Turborepo
- **API Tipada**: Eden Treaty (Elysia)

## Estrutura do Projeto

```
design-hub/
├── apps/
│   ├── web/          # Aplicação principal (portal de chamados)
│   └── admin/        # Painel administrativo
├── packages/
│   ├── ui/           # Componentes de UI compartilhados
│   ├── config/       # Configurações compartilhadas
│   └── api-client/   # Cliente API tipado com Eden Treaty
├── docs/             # Documentação do projeto
└── .mimocode/
    └── skills/       # Skills do agente
```

## Skills Instaladas

### Skills de Produto

1. **viral-product-principles** - 32 princípios para construir produtos virais
   - Landing pages que convertem
   - Pricing que vende
   - Copy que memoriza
   - CTAs que funcionam

2. **revenue-centric-design** - 101 princípios de design centrado em receita
   - Conversão e landing pages
   - Onboarding e ativação
   - Pricing e monetização
   - Churn e retenção
   - Ciência comportamental

### Skills de Design

3. **emil-design-eng** - Skills para Design Engineers
   - Animações e motion design
   - Easing e duração
   - Física e naturalidade
   - Performance e acessibilidade

### Skills de Engenharia

4. **grill-me** - Entrevista relaxante sobre planos e designs
   - Uma pergunta por vez
   - Respostas recomendadas
   - Exploração do codebase
   - Documentação de decisões

## Como Usar as Skills

As skills são ferramentas que devem ser utilizadas automaticamente pelo agente sempre que necessário:

### Para Landing Pages e Marketing

- Use `viral-product-principles` para revisar copy, design e conversão
- Use `revenue-centric-design` para decisões de produto e monetização

### Para Animações e UI

- Use `emil-design-eng` para implementar e revisar animações
- Use `review-animations` para auditoria rigorosa

### Para Planejamento

- Use `grill-me` antes de implementar qualquer feature
- Use para alinhar entendimento antes de escrever código

## Regras de Negócio

### Fluxo Principal

1. Usuário preenche formulário no Google Forms
2. Formulário chega ao sistema como uma task/card
3. Card fica disponível para toda a equipe
4. Membro da equipe abre o card e vê as informações do design
5. Membro pode atribuir o card a si mesmo
6. SLA configurável controla prazos

### Funcionalidades

- **Formulário de Entrada**: Integração com Google Forms
- **Kanban Board**: Visualização de cards por status
- **Atribuição**: Designers podem pegar cards
- **SLA**: Prazos configuráveis por tipo de demanda
- **Notificações**: Alertas de prazo e atribuição
- **Dashboard**: Métricas de produtividade

## Desenvolvimento

### Pré-requisitos

- Bun (https://bun.sh)
- Node.js 18+ (para ferramentas auxiliares)

### Setup

```bash
# Instalar dependências
bun install

# Rodar em desenvolvimento
bun run dev

# Build para produção
bun run build
```

### Estrutura de Comando

```bash
# Rodar app web
bun run --filter=web dev

# Rodar app admin
bun run --filter=admin dev

# Rodar todos os apps
bun run dev
```

## Princípios de Design

### Princípios Virais (32 regras)

1. Não ter plano gratuito
2. Usar apenas 3 cores
3. Usar números em vez de adjetivos
4. Ter um footer compartilhável
5. Tratar OG image como thumbnail do YouTube
6. Revelar uma ideia por tela
7. Headline que uma criança de 5 anos entende
8. Paywall duro
9. Copy única
10. Mostrar antes de explicar
11. Fazer apenas uma coisa
12. Pricing Popcorn (3 opções)
13. Surfear ondas
14. Copiar copy dos clientes
15. Fundador visível
16. Pricing impossível de ignorar
17. Headline memorável
18. Headline emocional
19. Fazer algo nunca visto
20. Hero section vende sozinha
21. Empatia antes de vender
22. Um único CTA
23. Nome memorável
24. Vender desejo, não feature
25. Deixar experimentar antes de comprar
26. Não usar palavras fracas
27. Não ter assinatura
28. CTA que diz o que acontece depois
29. Testemunhos obrigatórios
30. Descrever em menos de 10 palavras
31. Comparar com concorrentes
32. Ser mais caro que concorrentes

### Revenue-Centric Design (9 princípios spine)

1. Neutralidade é omissão
2. Quem fala com todos convence ninguém
3. Valor primeiro, depois pergunta
4. Sua promessa é o tamanho da sua prova
5. Igual compete no preço, diferente na categoria
6. Default é a decisão que você tomou pelo usuário
7. Retenção é construída, não pedida
8. Expansão nasce do uso
9. Preço é filtro

## Licença

Proprietary - Uso interno apenas.
