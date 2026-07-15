import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const tagRoutes = new Elysia({ prefix: '/api/tags' })
  .get('/', async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')

    if (error) throw error
    return data
  })
  .post(
    '/',
    async ({ body }) => {
      const { data, error } = await supabase
        .from('tags')
        .insert(body)
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      body: t.Object({
        name: t.String(),
        color: t.Optional(t.String()),
      }),
    }
  )
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Tag not found' }
    }

    return { success: true }
  })
