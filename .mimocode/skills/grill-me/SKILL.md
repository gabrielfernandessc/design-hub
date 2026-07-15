# Grill Me Skill

> Get relentlessly interviewed about a plan or design until every branch of the decision tree is resolved.

## When to Use

- Before writing a PRD
- Before asking an agent to implement a feature
- Before committing to a data model or API shape
- When several design choices depend on each other
- When you want the agent to push back instead of agree
- When you have an idea, plan, architecture, or feature direction that needs questioning

## How It Works

1. **One question at a time** — The agent asks one question, provides a recommended answer, and waits for feedback.
2. **Codebase exploration** — If the answer can be found by exploring the codebase, the agent inspects the code instead of asking you.
3. **Relentless interview** — The agent continues until every branch of the decision tree is resolved.
4. **Decision documentation** — Each decision is recorded for future reference.

## Question Categories

### Architecture

- What is the primary responsibility of this module?
- What are the boundaries between this and other modules?
- What data flows in and out?
- What are the failure modes?

### Data Model

- What entities are involved?
- What are the relationships between them?
- What are the constraints?
- What is the access pattern?

### API Design

- What operations are needed?
- What is the request/response shape?
- What are the error cases?
- What is the versioning strategy?

### User Experience

- Who is the primary user?
- What is the user's goal?
- What are the edge cases?
- What is the fallback behavior?

### Performance

- What are the latency requirements?
- What are the throughput requirements?
- What are the scale expectations?
- What are the caching strategies?

## Implementation Checklist

Before starting any feature:

- [ ] **Grill Session**: Run through the decision tree
- [ ] **Codebase Review**: Check existing patterns
- [ ] **Boundary Definition**: Clear module boundaries
- [ ] **Data Model**: Entities and relationships defined
- [ ] **API Shape**: Request/response contracts
- [ ] **Error Handling**: Failure modes identified
- [ ] **Performance**: Requirements documented

## Review Questions

1. Has every branch of the decision tree been resolved?
2. Are there any assumptions that need validation?
3. What are the risks and trade-offs?
4. What is the minimal viable implementation?
5. What can be deferred to later?
