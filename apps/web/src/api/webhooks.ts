import { Elysia, t } from 'elysia'
import { supabase } from '@design-hub/config'

export const webhookRoutes = new Elysia({ prefix: '/api/webhook' }).post(
  '/google-forms',
  async ({ body }) => {
    // TODO: Validate webhook signature from Google

    const { requesterName, requesterEmail, title, description, category, priority, dueDate } = body

    // Create card from form submission
    const { data: newCard, error: cardError } = await supabase
      .from('cards')
      .insert({
        title: title || 'Nova demanda de design',
        description: description || '',
        requester_name: requesterName,
        requester_email: requesterEmail,
        priority: priority || 'medium',
        status: 'new',
        due_date: dueDate || null,
      })
      .select()
      .single()

    if (cardError) throw cardError

    // TODO: Find or create category based on category name

    // Notify all designers
    const { data: designers } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'designer')

    if (designers) {
      for (const designer of designers) {
        await supabase
          .from('notifications')
          .insert({
            type: 'new_card',
            title: 'Nova demanda de design',
            message: `${requesterName} enviou uma nova demanda: ${title}`,
            user_id: designer.id,
            card_id: newCard.id,
          })
      }
    }

    return {
      success: true,
      cardId: newCard.id,
    }
  },
  {
    body: t.Object({
      requesterName: t.String(),
      requesterEmail: t.String(),
      title: t.String(),
      description: t.Optional(t.String()),
      category: t.Optional(t.String()),
      priority: t.Optional(t.String()),
      dueDate: t.Optional(t.String()),
    }),
  }
)
