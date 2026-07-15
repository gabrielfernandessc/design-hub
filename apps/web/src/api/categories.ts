import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const categoryRoutes = new Elysia({ prefix: '/api/categories' })
  .get('/', async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')

    if (error) throw error
    return data
  })
  .get('/:id', async ({ params }) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return { error: 'Category not found' }
    }

    return data
  })
  .post(
    '/',
    async ({ body }) => {
      const { data, error } = await supabase
        .from('categories')
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
        slaHours: t.Optional(t.Number()),
        sortOrder: t.Optional(t.Number()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(body)
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'Category not found' }
      }

      return data
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        color: t.Optional(t.String()),
        slaHours: t.Optional(t.Number()),
        sortOrder: t.Optional(t.Number()),
      }),
    }
  )
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Category not found' }
    }

    return { success: true }
  })
