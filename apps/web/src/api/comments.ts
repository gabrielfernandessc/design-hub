import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const commentRoutes = new Elysia({ prefix: '/api' })
  .get('/cards/:cardId/comments', async ({ params }) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:users(*)')
      .eq('card_id', params.cardId)

    if (error) throw error
    return data
  })
  .post(
    '/cards/:cardId/comments',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          ...body,
          card_id: params.cardId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      body: t.Object({
        content: t.String(),
        authorId: t.String(),
      }),
    }
  )
  .delete('/comments/:id', async ({ params }) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Comment not found' }
    }

    return { success: true }
  })
