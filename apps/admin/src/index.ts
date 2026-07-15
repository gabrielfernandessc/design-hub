import { Elysia } from 'elysia'

const app = new Elysia()
  .get('/', () => ({ message: 'Design Hub Admin API' }))
  .listen(3001)

console.log(`🦊 Admin server running at http://localhost:${app.server?.port}`)

export type App = typeof app
