import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const commentRoutes = new Elysia({ prefix: '/api/comments' })
  .get('/:id', async ({ params }) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:users(*)')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return { error: 'Comment not found' }
    }

    return data
  })
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Comment not found' }
    }

    return { success: true }
  })
