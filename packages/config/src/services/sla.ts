import { supabase } from '../db'

// SLA configuration by priority (in hours)
const SLA_CONFIG = {
  high: 24,
  medium: 48,
  low: 72,
}

// Check SLA status for a card
export async function checkSLAStatus(cardId: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card || !card.sla_started_at) {
    return null
  }

  const slaHours = SLA_CONFIG[card.priority as keyof typeof SLA_CONFIG] || 48
  const slaEndDate = new Date(card.sla_started_at)
  slaEndDate.setHours(slaEndDate.getHours() + slaHours)

  const now = new Date()
  const remainingMs = slaEndDate.getTime() - now.getTime()
  const remainingHours = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60)))

  return {
    cardId: card.id,
    priority: card.priority,
    slaStartedAt: card.sla_started_at,
    slaEndDate,
    remainingHours,
    isOverdue: remainingHours <= 0,
    isWarning: remainingHours <= 4 && remainingHours > 0,
  }
}

// Start SLA timer when card is assigned
export async function startSLA(cardId: string) {
  const { error } = await supabase
    .from('cards')
    .update({ sla_started_at: new Date().toISOString() })
    .eq('id', cardId)

  if (error) throw error
}

// Pause SLA timer when waiting for feedback
export async function pauseSLA(cardId: string) {
  const { error } = await supabase
    .from('cards')
    .update({ sla_paused_at: new Date().toISOString() })
    .eq('id', cardId)

  if (error) throw error
}

// Resume SLA timer
export async function resumeSLA(cardId: string) {
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single()

  if (!card || !card.sla_paused_at) return

  const pausedDuration = Date.now() - new Date(card.sla_paused_at).getTime()
  const newStartDate = new Date(new Date(card.sla_started_at!).getTime() + pausedDuration)

  const { error } = await supabase
    .from('cards')
    .update({
      sla_started_at: newStartDate.toISOString(),
      sla_paused_at: null,
    })
    .eq('id', cardId)

  if (error) throw error
}

// Check all cards and send SLA notifications
export async function checkAllSLAs() {
  const { data: activeCards } = await supabase
    .from('cards')
    .select('*')
    .eq('status', 'in_progress')

  if (!activeCards) return

  for (const card of activeCards) {
    if (!card.sla_started_at) continue

    const slaStatus = await checkSLAStatus(card.id)
    if (!slaStatus) continue

    // Send warning notification
    if (slaStatus.isWarning) {
      await sendSLANotification(card, 'warning', slaStatus.remainingHours)
    }

    // Send overdue notification
    if (slaStatus.isOverdue) {
      await sendSLANotification(card, 'overdue', 0)
    }
  }
}

// Send SLA notification
async function sendSLANotification(card: any, type: 'warning' | 'overdue', remainingHours: number) {
  // Check if notification already exists
  const { data: existingNotif } = await supabase
    .from('notifications')
    .select('id')
    .eq('card_id', card.id)
    .eq('type', `sla_${type}`)
    .single()

  if (existingNotif) return

  const title = type === 'warning' ? `SLA Warning: ${remainingHours}h remaining` : 'SLA Overdue'

  const message =
    type === 'warning'
      ? `Card "${card.title}" has ${remainingHours} hours remaining to meet SLA`
      : `Card "${card.title}" has exceeded its SLA deadline`

  // Notify assignee
  if (card.assignee_id) {
    await supabase
      .from('notifications')
      .insert({
        type: `sla_${type}`,
        title,
        message,
        user_id: card.assignee_id,
        card_id: card.id,
      })
  }

  // Notify all admins
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')

  if (admins) {
    for (const admin of admins) {
      await supabase
        .from('notifications')
        .insert({
          type: `sla_${type}`,
          title,
          message,
          user_id: admin.id,
          card_id: card.id,
        })
    }
  }
}
