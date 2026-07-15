import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const notificationRoutes = new Elysia({ prefix: '/api/notifications' })
  .get('/', async ({ query }) => {
    const { userId, isRead } = query

    let queryBuilder = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (userId) queryBuilder = queryBuilder.eq('user_id', userId)
    if (isRead !== undefined) queryBuilder = queryBuilder.eq('is_read', isRead === 'true')

    const { data, error } = await queryBuilder

    if (error) throw error
    return data
  })
  .patch('/:id/read', async ({ params }) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', params.id)
      .select()
      .single()

    if (error || !data) {
      return { error: 'Notification not found' }
    }

    return data
  })
  .patch(
    '/read-all',
    async ({ query }) => {
      const { userId } = query

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)

      if (error) throw error
      return { success: true }
    },
    {
      query: t.Object({
        userId: t.String(),
      }),
    }
  )
