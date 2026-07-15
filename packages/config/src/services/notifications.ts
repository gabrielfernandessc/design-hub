import { supabase } from '../db'

// Create a notification
export async function createNotification(data: {
  type: string
  title: string
  message?: string
  userId: string
  cardId?: string
}) {
  const { data: result, error } = await supabase
    .from('notifications')
    .insert({
      type: data.type,
      title: data.title,
      message: data.message,
      user_id: data.userId,
      card_id: data.cardId,
    })
    .select()
    .single()

  if (error) throw error
  return result
}

// Notify when card is created
export async function notifyCardCreated(cardId: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card) return

  // Notify all designers
  const { data: designers } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'designer')

  if (!designers) return

  for (const designer of designers) {
    await createNotification({
      type: 'card_created',
      title: 'New design request',
      message: `${card.requester_name} submitted a new request: ${card.title}`,
      userId: designer.id,
      cardId: card.id,
    })
  }
}

// Notify when card is assigned
export async function notifyCardAssigned(cardId: string, assigneeId: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card) return

  await createNotification({
    type: 'card_assigned',
    title: 'Card assigned to you',
    message: `You have been assigned to: ${card.title}`,
    userId: assigneeId,
    cardId: card.id,
  })
}

// Notify when card status changes
export async function notifyStatusChange(cardId: string, newStatus: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card) return

  const statusLabels: Record<string, string> = {
    new: 'New',
    in_progress: 'In Progress',
    waiting_feedback: 'Waiting Feedback',
    completed: 'Completed',
  }

  // Notify requester
  if (card.requester_email) {
    // Find user by email or create notification for all admins
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    if (admins) {
      for (const admin of admins) {
        await createNotification({
          type: 'status_changed',
          title: 'Card status updated',
          message: `"${card.title}" is now ${statusLabels[newStatus] || newStatus}`,
          userId: admin.id,
          cardId: card.id,
        })
      }
    }
  }

  // Notify assignee if status is completed
  if (newStatus === 'completed' && card.assignee_id) {
    await createNotification({
      type: 'card_completed',
      title: 'Card completed',
      message: `Your card "${card.title}" has been marked as completed`,
      userId: card.assignee_id,
      cardId: card.id,
    })
  }
}

// Notify when comment is added
export async function notifyCommentAdded(cardId: string, authorId: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card) return

  // Notify assignee
  if (card.assignee_id && card.assignee_id !== authorId) {
    await createNotification({
      type: 'comment_added',
      title: 'New comment on your card',
      message: `Someone commented on "${card.title}"`,
      userId: card.assignee_id,
      cardId: card.id,
    })
  }

  // Notify requester
  if (card.requester_email) {
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')

    if (admins) {
      for (const admin of admins) {
        if (admin.id !== authorId) {
          await createNotification({
            type: 'comment_added',
            title: 'New comment on card',
            message: `New comment on "${card.title}"`,
            userId: admin.id,
            cardId: card.id,
          })
        }
      }
    }
  }
}

// Get user notifications
export async function getUserNotifications(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

// Mark notification as read
export async function markAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Mark all user notifications as read
export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)

  if (error) throw error
}

// Get unread count
export async function getUnreadCount(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) throw error
  return data?.length || 0
}
