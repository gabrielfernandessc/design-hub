import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { authRoutes } from './api/auth'
import { userRoutes } from './api/users'
import { projectRoutes } from './api/projects'
import { cardRoutes } from './api/cards'
import { tagRoutes } from './api/tags'
import { categoryRoutes } from './api/categories'
import { notificationRoutes } from './api/notifications'
import { webhookRoutes } from './api/webhooks'
import { paymentRoutes } from './api/payments'
import { join } from 'path'

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'dev-secret',
    })
  )
  .use(authRoutes)
  .use(userRoutes)
  .use(projectRoutes)
  .use(cardRoutes)
  .use(tagRoutes)
  .use(categoryRoutes)
  .use(notificationRoutes)
  .use(webhookRoutes)
  .use(paymentRoutes)

// Serve the frontend
app.get('/', async () => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Hub - Portal de Chamados</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div id="root"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html' } })
})

app.listen(3000)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)

export type App = typeof app
