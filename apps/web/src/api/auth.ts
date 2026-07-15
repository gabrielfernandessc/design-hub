import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post(
    '/login',
    async ({ body, jwt }) => {
      const { email, password } = body

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        return { error: 'User not found' }
      }

      // TODO: Implement proper password hashing
      if (user.password !== password) {
        return { error: 'Invalid password' }
      }

      const token = await jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .get('/me', async ({ headers, jwt }) => {
    const auth = headers.authorization

    if (!auth) {
      return { error: 'Unauthorized' }
    }

    const token = auth.replace('Bearer ', '')
    const payload = await jwt.verify(token)

    if (!payload) {
      return { error: 'Invalid token' }
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.id as string)
      .single()

    if (error || !user) {
      return { error: 'User not found' }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  })
