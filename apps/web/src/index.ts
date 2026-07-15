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

// Serve the frontend HTML
app.get('/', async () => {
  const htmlPath = join(process.cwd(), 'dist', 'client', 'main.js')
  try {
    const js = await Bun.file(htmlPath).text()
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Hub</title>
  <link rel="stylesheet" href="/main.css">
</head>
<body>
  <div id="root"></div>
  <script>${js}</script>
</body>
</html>`, { headers: { 'Content-Type': 'text/html' } })
  } catch {
    return { message: 'Design Hub API' }
  }
})

// Serve CSS
app.get('/main.css', async () => {
  const cssPath = join(process.cwd(), 'dist', 'client', 'main.css')
  try {
    const css = await Bun.file(cssPath).text()
    return new Response(css, { headers: { 'Content-Type': 'text/css' } })
  } catch {
    return new Response('', { headers: { 'Content-Type': 'text/css' } })
  }
})

app.listen(3000)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)

export type App = typeof app
