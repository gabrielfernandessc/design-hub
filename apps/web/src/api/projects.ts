import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const projectRoutes = new Elysia({ prefix: '/api/projects' })
  .get('/', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')

    if (error) throw error
    return data
  })
  .get('/:id', async ({ params }) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return { error: 'Project not found' }
    }

    return data
  })
  .post(
    '/',
    async ({ body }) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(body)
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        color: t.Optional(t.String()),
        ownerId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(body)
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'Project not found' }
      }

      return data
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        description: t.Optional(t.String()),
        color: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Project not found' }
    }

    return { success: true }
  })
