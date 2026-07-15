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
  .get('/', () => ({ message: 'Design Hub API', status: 'running' }))
  .listen(3000)

console.log(`🦊 Server running at http://localhost:${app.server?.port}`)

export type App = typeof app
