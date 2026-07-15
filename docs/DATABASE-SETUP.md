# Setup do PostgreSQL na Railway

## Passo 1: Criar conta na Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "Start a New Project"
3. Faça login com GitHub

## Passo 2: Criar projeto

1. Clique em "New Project"
2. Selecione "PostgreSQL"
3. Aguarde o banco ser criado

## Passo 3: Copiar URL de conexão

1. Clique no banco PostgreSQL criado
2. Vá na aba "Connect"
3. Copie a URL de conexão (Internal ou Public)

A URL deve ter este formato:

```
postgresql://postgres:password@host.railway.app:5432/railway
```

## Passo 4: Atualizar .env

Edite o arquivo `.env` na raiz do projeto:

```bash
DATABASE_URL="sua-url-aqui"
```

## Passo 5: Gerar migrations

```bash
cd packages/config
bun run db:generate
```

## Passo 6: Aplicar migrations

```bash
cd packages/config
bun run db:migrate
```

## Passo 7: Verificar

```bash
cd packages/config
bun run db:studio
```

Isso abre o Drizzle Studio onde você pode ver as tabelas criadas.

---

## Troubleshooting

### Erro de conexão

- Verifique se a URL está correta no .env
- Verifique se o banco está rodando na Railway
- Tente usar a URL pública em vez da interna

### Erro de permissão

- Verifique se o usuário e senha estão corretos
- Tente redefinir a senha no painel da Railway

### Tabelas não criadas

- Execute `bun run db:generate` primeiro
- Depois execute `bun run db:migrate`
