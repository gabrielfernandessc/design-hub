import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const userRoutes = new Elysia({ prefix: '/api/users' })
  .get('/', async () => {
    console.log('=== Fetching users ===')
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('*')
      
      console.log('Query result:', JSON.stringify({ data, error, count }))
      
      if (error) {
        console.error('Supabase error:', error)
        return { error: error.message }
      }
      
      console.log('Users found:', data?.length || 0)
      return data || []
    } catch (err) {
      console.error('Exception:', err)
      return { error: 'Failed to fetch users' }
    }
  })
  .get('/:id', async ({ params }) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar, is_active')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return { error: 'User not found' }
    }

    return data
  })
  .post(
    '/',
    async ({ body }) => {
      const { data, error } = await supabase
        .from('users')
        .insert(body)
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      body: t.Object({
        email: t.String(),
        name: t.String(),
        password: t.String(),
        role: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('users')
        .update(body)
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'User not found' }
      }

      return data
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        role: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
        isActive: t.Optional(t.Boolean()),
      }),
    }
  )
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'User not found' }
    }

    return { success: true }
  })
