import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const cardRoutes = new Elysia({ prefix: '/api/cards' })
  .get('/', async ({ query }) => {
    const { status, projectId, assigneeId, categoryId } = query

    let queryBuilder = supabase
      .from('cards')
      .select('*, assignee:users!cards_assignee_id_fkey(*), project:projects(*), category:categories(*)')

    if (status) queryBuilder = queryBuilder.eq('status', status)
    if (projectId) queryBuilder = queryBuilder.eq('project_id', projectId)
    if (assigneeId) queryBuilder = queryBuilder.eq('assignee_id', assigneeId)
    if (categoryId) queryBuilder = queryBuilder.eq('category_id', categoryId)

    const { data, error } = await queryBuilder

    if (error) throw error
    return data
  })
  .get('/:id', async ({ params }) => {
    const { data, error } = await supabase
      .from('cards')
      .select('*, assignee:users!cards_assignee_id_fkey(*), project:projects(*), category:categories(*), comments(*), attachments(*), tags(*)')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      return { error: 'Card not found' }
    }

    return data
  })
  .post(
    '/',
    async ({ body }) => {
      const { data, error } = await supabase
        .from('cards')
        .insert(body)
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String()),
        status: t.Optional(t.String()),
        priority: t.Optional(t.String()),
        requesterName: t.Optional(t.String()),
        requesterEmail: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        assigneeId: t.Optional(t.String()),
        projectId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    }
  )
  .put(
    '/:id',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('cards')
        .update(body)
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'Card not found' }
      }

      return data
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        priority: t.Optional(t.String()),
        requesterName: t.Optional(t.String()),
        requesterEmail: t.Optional(t.String()),
        dueDate: t.Optional(t.String()),
        assigneeId: t.Optional(t.String()),
        projectId: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
    }
  )
  .patch(
    '/:id/status',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('cards')
        .update({ status: body.status })
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'Card not found' }
      }

      return data
    },
    {
      body: t.Object({
        status: t.String(),
      }),
    }
  )
  .patch(
    '/:id/assign',
    async ({ params, body }) => {
      const { data, error } = await supabase
        .from('cards')
        .update({
          assignee_id: body.assigneeId,
          status: body.assigneeId ? 'in_progress' : 'new',
        })
        .eq('id', params.id)
        .select()
        .single()

      if (error || !data) {
        return { error: 'Card not found' }
      }

      return data
    },
    {
      body: t.Object({
        assigneeId: t.String(),
      }),
    }
  )
  .delete('/:id', async ({ params }) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', params.id)

    if (error) {
      return { error: 'Card not found' }
    }

    return { success: true }
  })
