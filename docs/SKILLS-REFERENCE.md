# Referência de Skills - Design Hub

## Visão Geral

As skills são ferramentas que devem ser utilizadas automaticamente pelo agente sempre que necessário. Este documento referencia todas as skills instaladas e quando usá-las.

## Skills Instaladas

### 1. viral-product-principles

**Localização**: `.mimocode/skills/viral-product-principles/SKILL.md`

**Quando usar**:

- Construindo ou revisando landing pages
- Projetando seções de pricing
- Escrevendo copy de produto
- Revisando otimização de conversão
- Criando materiais de marketing
- Qualquer UI que precisa impulsionar viralidade e conversões

**Princípios cobertos**:

- 32 regras para produtos virais
- Pricing Popcorn
- Headlines memoráveis
- CTAs eficazes
- Testemunhos
- OG images

**Checklist de implementação**:

- [ ] Hero: Mostra o produto? Headline emocional? Um CTA?
- [ ] Pricing: Popcorn Pricing (3 tiers)? No header? Paywall duro?
- [ ] Copy: Única? Usa números? Evita palavras fracas?
- [ ] Social Proof: Testemunhos? Fundador visível?
- [ ] Footer: Compartilhável? Forte?
- [ ] OG Image: Parece thumbnail do YouTube?
- [ ] Geral: Descrevível em menos de 10 palavras? Faz uma coisa?

---

### 2. revenue-centric-design

**Localização**: `.mimocode/skills/revenue-centric-design/SKILL.md`

**Quando usar**:

- Projetando landing pages ou sites de marketing
- Construindo páginas de pricing
- Criando fluxos de onboarding
- Trabalhando em otimização de conversão
- Construindo qualquer interface de produto
- Revisando decisões de design de produto

**Princípios spine (9)**:

1. Neutralidade é omissão
2. Quem fala com todos convence ninguém
3. Valor primeiro, depois pergunta
4. Sua promessa é o tamanho da sua prova
5. Igual compete no preço, diferente na categoria
6. Default é a decisão que você tomou pelo usuário
7. Retenção é construída, não pedida
8. Expansão nasce do uso
9. Preço é filtro

**Áreas temáticas**:

- Conversão e landing pages (16 princípios)
- Onboarding e ativação (19 princípios)
- Revenue-Centric Design (13 princípios)
- Pricing e monetização (11 princípios)
- Churn e retenção (9 princípios)
- Toolkit de ciência comportamental (7 princípios)
- Estratégia de produto (7 princípios)
- Posicionamento e GTM (8 princípios)
- Diferenciação na era de AI (7 princípios)
- Métricas e experimentação (4 princípios)

---

### 3. emil-design-eng

**Localização**: `.mimocode/skills/emil-design-eng/SKILL.md`

**Quando usar**:

- Construindo ou revisando animações
- Implementando transições e micro-interações
- Projetando sistemas de motion
- Revisando UI/UX para oportunidades de animação
- Criando interfaces fluidas tipo Apple

**Skills principais**:

- **emil-design-eng**: Skill principal para animação e design
- **review-animations**: Revisão rigorosa baseada em princípios
- **improve-animations**: Auditoria de todas as animações
- **find-animation-opportunities**: Busca por oportunidades
- **animation-vocabulary**: Vocabulário preciso de motion
- **apple-design**: Princípios da Apple para design

**Princípios de animação**:

- **Easing**: Enter = ease-out, Exit = ease-in, Move = ease-in-out
- **Duração**: Micro = 100-200ms, Página = 200-400ms, Complexa = 400-800ms
- **Física**: Sentir físico, spring physics, evitar robótico
- **Interruptibilidade**: Poder cancelar no meio
- **Performance**: Apenas transform e opacity
- **Acessibilidade**: Respeitar prefers-reduced-motion

---

### 4. grill-me

**Localização**: `.mimocode/skills/grill-me/SKILL.md`

**Quando usar**:

- Antes de escrever um PRD
- Antes de pedir a um agente para implementar uma feature
- Antes de se comprometer com um modelo de dados ou forma de API
- Quando várias escolhas de design dependem umas das outras
- Quando você quer que o agente conteste em vez de concordar
- Quando você tem uma ideia, plano, arquitetura ou direção de feature que precisa de questionamento

**Como funciona**:

1. Uma pergunta por vez
2. Resposta recomendada fornecida
3. Espera feedback antes de continuar
4. Explora codebase quando possível
5. Documenta decisões

**Categorias de perguntas**:

- Arquitetura
- Modelo de dados
- Design de API
- Experiência do usuário
- Performance

---

## Quando Usar Cada Skill

### Para Landing Pages e Marketing

```
viral-product-principles → Revisar copy, design e conversão
revenue-centric-design → Decisões de produto e monetização
```

### Para Animações e UI

```
emil-design-eng → Implementar e revisar animações
review-animations → Auditoria rigorosa
```

### Para Planejamento

```
grill-me → Antes de implementar qualquer feature
grill-me → Alinhar entendimento antes de escrever código
```

### Para Arquitetura

```
revenue-centric-design → Princípios de produto
grill-me → Questionar decisões de arquitetura
```

## Ordem de Uso Recomendada

### Nova Feature

1. **grill-me**: Questionar a feature até todas as decisões estarem resolvidas
2. **revenue-centric-design**: Alinhar com princípios de produto
3. **viral-product-principles**: Revisar aspectos de conversão
4. **emil-design-eng**: Implementar animações

### Revisão de Código

1. **emil-design-eng**: Revisar animações
2. **review-animations**: Auditoria rigorosa
3. **viral-product-principles**: Revisar UX
4. **revenue-centric-design**: Revisar decisões de produto

### Planejamento de Projeto

1. **grill-me**: Questionar arquitetura
2. **revenue-centric-design**: Definir princípios
3. **viral-product-principles**: Definir requisitos de conversão
